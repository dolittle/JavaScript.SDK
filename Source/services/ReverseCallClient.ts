// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';
import { CompletionObserver, concat, ErrorObserver, merge, NextObserver, Observable, partition, Subject, Subscriber, TimeoutError, Unsubscribable } from 'rxjs';
import { filter, map, timeout } from 'rxjs/operators';
import { Guid } from '@dolittle/rudiments';

import { ExecutionContext } from '@dolittle/sdk.execution';
import { ExecutionContexts, Guids } from '@dolittle/sdk.protobuf';
import { Cancellation } from '@dolittle/sdk.resilience';

import { Ping, Pong } from '@dolittle/contracts/Services/Ping_pb';
import { ReverseCallArgumentsContext, ReverseCallRequestContext, ReverseCallResponseContext } from '@dolittle/contracts/Services/ReverseCallContext_pb';
import { Duration } from 'google-protobuf/google/protobuf/duration_pb';

import { DidNotReceiveConnectResponse } from './DidNotReceiveConnectResponse';
import { IReverseCallClient, ReverseCallCallback } from './IReverseCallClient';
import { PingTimeout } from './PingTimeout';

/**
 * Represents an implementation of {@link IReverseCallClient}.
 * @template TClientMessage The type of the messages from the client to the server.
 * @template TServerMessage The type of the messages from the server to the client.
 * @template TConnectArguments The type of the connect arguments message.
 * @template TConnectResponse The type of the connect response message.
 * @template TRequest The type of the request messages.
 * @template TResponse The type of the response messages.
 */
export class ReverseCallClient<TClientMessage, TServerMessage, TConnectArguments, TConnectResponse, TRequest, TResponse> extends IReverseCallClient<TConnectResponse> {
    private _observable: Observable<TConnectResponse>;

    /**
     * Creates a new instance of the {@link ReverseCallClient} class.
     * @param {(Observable, Cancellation) => Observable<TServerMessage>} _establishConnection - The callback to use to establish a new connection.
     * @param {() => TClientMessage} _messageConstructor - The constructor to use to create a new {@link TClientMessage}.
     * @param {(TClientMessage, TConnectArguments) => void} _setConnectArguments - The callback to use to set the connect arguments to a client message.
     * @param {(TServerMessage) => TRequest | undefined} _getConnectResponse - The callback to use to get the connect response from a server message.
     * @param {(TServerMessage) => TRequest | undefined} _getMessageRequest - The callback to use to get a request from a server message.
     * @param {(TClientMessage, TResponse) => void} _setMessageResponse - The callback to use to set a response to a client message.
     * @param {(TConnectArguments, ReverseCallArgumentsContext) => void} _setArgumentsContext - The callback to use to set the call context in a connect arguments message.
     * @param {(TRequest) => ReverseCallRequestContext | undefined} _getRequestContext - The callback to use to get the call context from a request message.
     * @param {(TResponse, ReverseCallResponseContext) => void} _setResponseContext - The callback to use to set the call context in a response message.
     * @param {(TServerMessage) => Ping | undefined} _getMessagePing - The callback to use to get a ping from a server message.
     * @param {(TClientMessage, Pong) => void} _setMessagePong - The callback to use to set a pong in a client message.
     * @param {ExecutionContext} _executionContext - The execution context of the client.
     * @param {TConnectArguments} _connectArguments - The connect arguments to use to initiate the reverse call client.
     * @param {number} _pingInterval - The interval to request the server to send pings (in seconds).
     * @param {ReverseCallCallback<TRequest, TResponse>} _callback - The callback to use to handle requests from the server to the client.
     * @param {Cancellation} _cancellation - The cancellation token to use to cancel the reverse call client.
     * @param {Logger} _logger - The logger to use for logging.
     */
    constructor(
        private _establishConnection: (requests: Observable<TClientMessage>, cancellation: Cancellation) => Observable<TServerMessage>,
        private _messageConstructor: new () => TClientMessage,
        private _setConnectArguments: (message: TClientMessage, connectArguments: TConnectArguments) => void,
        private _getConnectResponse: (message: TServerMessage) => TConnectResponse | undefined,
        private _getMessageRequest: (message: TServerMessage) => TRequest | undefined,
        private _setMessageResponse: (message: TClientMessage, reponse: TResponse) => void,
        private _setArgumentsContext: (connectArguments: TConnectArguments, context: ReverseCallArgumentsContext) => void,
        private _getRequestContext: (request: TRequest) => ReverseCallRequestContext | undefined,
        private _setResponseContext: (response: TResponse, context: ReverseCallResponseContext) => void,
        private _getMessagePing: (message: TServerMessage) => Ping | undefined,
        private _setMessagePong: (message: TClientMessage, pong: Pong) => void,
        private _executionContext: ExecutionContext,
        private _connectArguments: TConnectArguments,
        private _pingInterval: number,
        private _callback: ReverseCallCallback<TRequest, TResponse>,
        private _cancellation: Cancellation,
        private _logger: Logger) {
        super();
        this._observable = this.create();
    }

    /** @inheritdoc */
    subscribe(observer?: NextObserver<TConnectResponse> | ErrorObserver<TConnectResponse> | CompletionObserver<TConnectResponse> | undefined): Unsubscribable;
    subscribe(next: null | undefined, error: null | undefined, complete: () => void): Unsubscribable;
    subscribe(next: null | undefined, error: (error: any) => void, complete?: (() => void) | undefined): Unsubscribable;
    // eslint-disable-next-line @typescript-eslint/unified-signatures
    subscribe(next: (value: TConnectResponse) => void, error: null | undefined, complete: () => void): Unsubscribable;
    subscribe(next?: ((value: TConnectResponse) => void) | undefined, error?: ((error: any) => void) | undefined, complete?: (() => void) | undefined): Unsubscribable;
    subscribe(next?: any, error?: any, complete?: any) {
        return this._observable.subscribe(next, error, complete);
    }

    /**
     * Creates an Observable and sets up the connection, pinging and response handling from the set/get methods.
     * @returns {Observable} The Observable, which pushes the connection response from the server if succesfull.
     */
    private create(): Observable<TConnectResponse> {
        const callContext = new ReverseCallArgumentsContext();
        callContext.setHeadid(Guids.toProtobuf(Guid.create()));

        const pingInterval = new Duration();
        const pingSeconds = Math.trunc(this._pingInterval);
        const pingNanos = Math.trunc((this._pingInterval - pingSeconds) * 1e9);
        pingInterval.setSeconds(pingSeconds);
        pingInterval.setNanos(pingNanos);
        callContext.setPinginterval(pingInterval);
        callContext.setExecutioncontext(ExecutionContexts.toProtobuf(this._executionContext));

        this._setArgumentsContext(this._connectArguments, callContext);

        const clientMessage = new this._messageConstructor();
        this._setConnectArguments(clientMessage, this._connectArguments);

        return new Observable<TConnectResponse>(subscriber => {
            const clientToServerMessages = new Subject<TClientMessage>();
            const serverToClientMessages = this._establishConnection(clientToServerMessages, this._cancellation);

            const [pings, requests] = partition(
                serverToClientMessages.pipe(
                    filter(this.isPingOrRequests, this),
                    timeout(this._pingInterval * 3e3)
                ),
                this.isPingMessage,
                this);

            const pongs = pings.pipe(map((message: TServerMessage) => {
                const responseMessage = new this._messageConstructor();
                const pong = new Pong();
                this._setMessagePong(responseMessage, pong);
                return responseMessage;
            }));

            const responses = new Subject<TClientMessage>();
            requests
                .pipe(filter(this.isValidMessage, this))
                .subscribe(this.handleServerRequests(responses));

            // write pongs and responses to the Runtime
            merge(pongs, responses).subscribe(clientToServerMessages);

            const connectResponse = serverToClientMessages.pipe(filter(this.isConnectResponse, this));
            const errorsAndCompletion = serverToClientMessages.pipe(filter(() => false));

            concat(connectResponse, errorsAndCompletion)
                .subscribe(this.handleConnectionResponse(subscriber));
            // send the connection request
            clientToServerMessages.next(clientMessage);
        });
    }

    private isPingOrRequests(message: TServerMessage): boolean {
        const ping = this._getMessagePing(message);
        const request = this._getMessageRequest(message);
        if (ping || request) {
            return true;
        }
        const connect = this._getConnectResponse(message);
        if (!connect) {
            this._logger.warn('Received message from Reverse Call Dispatcher, but it was not a request, ping or a connection response');
        }

        return false;
    }

    private isPingMessage(message: TServerMessage): boolean {
        return !!this._getMessagePing(message);
    }

    private isValidMessage(message: TServerMessage): boolean {
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

    private handleServerRequests(responses: Subject<TClientMessage>) {
        return {
            next: async (message: TServerMessage) => {
                try {
                    const request = this._getMessageRequest(message)!;
                    const context = this._getRequestContext(request)!;
                    const requestContext = ExecutionContexts.toSDK(context.getExecutioncontext()!);
                    const executionContext = this._executionContext
                        .forTenant(requestContext.tenantId.value)
                        .forClaims(requestContext.claims);

                    const response = await this._callback(request, executionContext);

                    const responseContext = new ReverseCallResponseContext();
                    responseContext.setCallid(context.getCallid());
                    this._setResponseContext(response, responseContext);
                    const responseMessage = new this._messageConstructor();
                    this._setMessageResponse(responseMessage, response);

                    responses.next(responseMessage);
                } catch (error) {
                    responses.error(error);
                }
            },
            error: (error: any) => {
                responses.error(error);
            }
        };
    }

    private isConnectResponse(message: TServerMessage): boolean {
        return !!this._getConnectResponse(message);
    }

    private handleConnectionResponse(subscriber: Subscriber<TConnectResponse>) {
        return {
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
        };
    }
}
