// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Subject, Observable, Unsubscribable, NextObserver, ErrorObserver, CompletionObserver, partition, merge, concat, TimeoutError } from 'rxjs';
import { first, skip, map, filter, timeout } from 'rxjs/operators';

import { Duration } from 'google-protobuf/google/protobuf/duration_pb';
import { Logger } from 'winston';

import { ReverseCallRequestContext, ReverseCallResponseContext, ReverseCallArgumentsContext } from '@dolittle/runtime.contracts/Fundamentals/Services/ReverseCallContext_pb';
import { Ping, Pong } from '@dolittle/runtime.contracts/Fundamentals/Services/Ping_pb';

import { Guid } from '@dolittle/rudiments';
import { IExecutionContextManager } from '@dolittle/sdk.execution';
import { executionContexts, guids } from '@dolittle/sdk.protobuf';

import { Cancellation } from './Cancellation';
import { DidNotReceiveConnectResponse } from './DidNotReceiveConnectResponse';
import { IReverseCallClient, ReverseCallCallback } from './IReverseCallClient';
import { PingTimeout } from './PingTimeout';

/**
 * Represents an implementation of {IReverseCallClient}.
 */
export class ReverseCallClient<TClientMessage, TServerMessage, TConnectArguments, TConnectResponse, TRequest, TResponse> implements IReverseCallClient<TConnectResponse> {
    private _observable: Observable<TConnectResponse>;

    constructor(
        private _establishConnection: (requests: Observable<TClientMessage>, cancellation: Cancellation) => Observable<TServerMessage>,
        private _messageConstructor: { new(): TClientMessage },
        private _setConnectArguments: (message: TClientMessage, connectArguments: TConnectArguments) => void,
        private _getConnectResponse: (message: TServerMessage) => TConnectResponse | undefined,
        private _getMessageRequest: (message: TServerMessage) => TRequest | undefined,
        private _setMessageResponse: (message: TClientMessage, reponse: TResponse) => void,
        private _setArgumentsContext: (connectArguments: TConnectArguments, context: ReverseCallArgumentsContext) => void,
        private _getRequestContext: (request: TRequest) => ReverseCallRequestContext | undefined,
        private _setResponseContext: (response: TResponse, context: ReverseCallResponseContext) => void,
        private _getMessagePing: (message: TServerMessage) => Ping | undefined,
        private _setMessagePong: (message: TClientMessage, pong: Pong) => void,
        private _executionContextManager: IExecutionContextManager,
        private _connectArguments: TConnectArguments,
        private _pingInterval: number,
        private _callback: ReverseCallCallback<TRequest, TResponse>,
        private _cancellation: Cancellation,
        private _logger: Logger)
    {
        this._observable = this.create();
    }

    subscribe(observer?: NextObserver<TConnectResponse> | ErrorObserver<TConnectResponse> | CompletionObserver<TConnectResponse> | undefined): Unsubscribable;
    subscribe(next: null | undefined, error: null | undefined, complete: () => void): Unsubscribable;
    subscribe(next: null | undefined, error: (error: any) => void, complete?: (() => void) | undefined): Unsubscribable;
    subscribe(next: (value: TConnectResponse) => void, error: null | undefined, complete: () => void): Unsubscribable;
    subscribe(next?: ((value: TConnectResponse) => void) | undefined, error?: ((error: any) => void) | undefined, complete?: (() => void) | undefined): Unsubscribable;
    subscribe(next?: any, error?: any, complete?: any) {
        return this._observable.subscribe(next, error, complete);
    }

    private create(): Observable<TConnectResponse> {
        const callContext = new ReverseCallArgumentsContext();
        callContext.setHeadid(guids.toProtobuf(Guid.create()));

        const pingInterval = new Duration();
        const pingSeconds = Math.trunc(this._pingInterval);
        const pingNanos = Math.trunc((this._pingInterval - pingSeconds) * 1e9);
        pingInterval.setSeconds(pingSeconds);
        pingInterval.setNanos(pingNanos);
        callContext.setPinginterval(pingInterval);

        const executionContext = executionContexts.toProtobuf(this._executionContextManager.current);
        callContext.setExecutioncontext(executionContext);

        this._setArgumentsContext(this._connectArguments, callContext);

        const clientMessage = new this._messageConstructor();
        this._setConnectArguments(clientMessage, this._connectArguments);

        return new Observable<TConnectResponse>(subscriber => {
            const toServerMessages = new Subject<TClientMessage>();
            const toClientMessages = this._establishConnection(toServerMessages, this._cancellation);

            toServerMessages.next(clientMessage);

            const [pings, requests] = partition(
                toClientMessages.pipe(
                    skip(1),
                    filter(this.onlyPingsOrRequests, this),
                    timeout(this._pingInterval * 3e3)
                ),
                this.isPingMessage, this);

            const pongs = pings.pipe(map((message: TServerMessage) => {
                const responseMessage = new this._messageConstructor();
                const pong = new Pong();
                this._setMessagePong(responseMessage, pong);
                return responseMessage;
            }));

            const responses = new Subject<TClientMessage>();
            requests.pipe(
                filter(this.onlyValidMessages, this),
                map(async (message: TServerMessage) => {
                    try {
                        const request = this._getMessageRequest(message)!;
                        const context = this._getRequestContext(request)!;
                        const executionContext = executionContexts.toSDK(context.getExecutioncontext()!);
                        this._executionContextManager.currentFor(executionContext.tenantId, executionContext.claims);
    
                        const response = await this._callback(request);
    
                        const responseContext = new ReverseCallResponseContext();
                        responseContext.setCallid(context.getCallid());
                        this._setResponseContext(response, responseContext);
                        const responseMessage = new this._messageConstructor();
                        this._setMessageResponse(responseMessage, response);
    
                        responses.next(responseMessage);
                    } catch (error) {
                        responses.error(error);
                    }
                })
            );

            merge(pongs, responses).subscribe(toServerMessages);


            const connectResponse = toClientMessages.pipe(first());
            const errorsAndCompletion = toClientMessages.pipe(filter(() => false));

            concat(connectResponse, errorsAndCompletion).subscribe({
                next: (message: TServerMessage) => {
                    const response = this._getConnectResponse(message);
                    if (!response) {
                        subscriber.error(new DidNotReceiveConnectResponse());
                        return;
                    }
                    subscriber.next(response);
                },
                error: (error: Error) => {
                    if (error instanceof TimeoutError) {
                        subscriber.error(new PingTimeout());
                        return;
                    }
                    subscriber.error(error);
                },
                complete: () => {
                    subscriber.complete();
                },
            });
        });
    }

    private onlyPingsOrRequests(message: TServerMessage): boolean {
        const ping = this._getMessagePing(message);
        const request = this._getMessageRequest(message);
        if (ping || request) {
            return true;
        }
        this._logger.warn('Received message from Reverse Call Dispatcher, but it was not a request or a ping');
        return false;
    }

    private isPingMessage(message: TServerMessage): boolean {
        return !!this._getMessagePing(message);
    }

    private onlyValidMessages(message: TServerMessage): boolean {
        const request = this._getMessageRequest(message)!;
        const context = this._getRequestContext(request);
        if (!context) {
            this._logger.warn('Received request from Reverse Call Dispatcher, but it did not contain a Reverse Call Context');
            return false;
        }
        if (!context.hasExecutioncontext()) {
            this._logger.warn('Received request from Reverse Call Dispatcher, but it did not contain an Execution Context');
            return false;
        }

        return true;
    }
}
