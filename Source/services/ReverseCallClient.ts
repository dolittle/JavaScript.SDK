// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IReverseCallClient, ReverseCallCallback } from './IReverseCallClient';
import { Subject, Observable, Unsubscribable, NextObserver, ErrorObserver, CompletionObserver } from 'rxjs';
import { first, skip, map, filter } from 'rxjs/operators';
import { ReverseCallRequestContext, ReverseCallResponseContext, ReverseCallArgumentsContext } from '@dolittle/runtime.contracts/Fundamentals/Services/ReverseCallContext_pb';

import { Duration } from "google-protobuf/google/protobuf/duration_pb";

import { executionContexts } from '@dolittle/sdk.protobuf';

import { IExecutionContextManager } from '@dolittle/sdk.execution';
import { Logger } from 'winston';
import { Cancellation } from './Cancellation';

import { Guid } from '@dolittle/rudiments';
import { guids } from '@dolittle/sdk.protobuf';

/**
 * Represents an implementation of {IReverseCallClient}.
 */
export class ReverseCallClient<TClientMessage, TServerMessage, TConnectArguments, TConnectResponse, TRequest, TResponse> implements IReverseCallClient<TConnectArguments, TConnectResponse, TRequest, TResponse> {
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
        private _executionContextManager: IExecutionContextManager,
        private _connectArguments: TConnectArguments,
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
        pingInterval.setSeconds(10000);
        callContext.setPinginterval(pingInterval);
        const executionContext = executionContexts.toProtobuf(this._executionContextManager.current);
        callContext.setExecutioncontext(executionContext);
        this._setArgumentsContext(this._connectArguments, callContext);

        const clientMessage = new this._messageConstructor();
        this._setConnectArguments(clientMessage, this._connectArguments);

        return new Observable<TConnectResponse>(subscriber => {
            console.log('OPENING CONNECTION');
            const toServerMessages = new Subject<TClientMessage>();
            const toClientMessages = this._establishConnection(toServerMessages, this._cancellation);

            toServerMessages.next(clientMessage);

            toClientMessages.pipe(
                skip(1),
                filter(this.onlyValidMessages, this),
                map((message: TServerMessage) => {
                    const request = this._getMessageRequest(message)!;
                    const context = this._getRequestContext(request)!;
                    const executionContext = executionContexts.toSDK(context.getExecutioncontext()!);
                    this._executionContextManager.currentFor(executionContext.tenantId, executionContext.claims);

                    const response = this._callback(request);
                    const responseContext = new ReverseCallResponseContext();
                    responseContext.setCallid(context.getCallid());
                    this._setResponseContext(response, responseContext);
                    const responseMessage = new this._messageConstructor();
                    this._setMessageResponse(responseMessage, response);
                    return responseMessage;
                })
            ).subscribe(toServerMessages);

            toClientMessages.subscribe({
                complete: () => subscriber.complete(),
                error: (error) => subscriber.error(error),
            });

            toClientMessages.pipe(first(), map((message: TServerMessage) => {
                return this._getConnectResponse(message) as TConnectResponse;
            })).subscribe(subscriber);
        });
    }

    private onlyValidMessages(message: TServerMessage) {
        const request = this._getMessageRequest(message);
        if (!request) {
            this._logger.warn('No request found');
            return false;
        }

        const context = this._getRequestContext(request);
        if (!context) {
            this._logger.warn('No context found');
            return false;
        }
        if (!context.hasExecutioncontext()) {
            this._logger.warn('No execution context found');
            return false;
        }

        return true;
    }
}
