// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IReverseCallClient } from 'IReverseCallClient';
import { Observer, Subscription, OperatorFunction, Subject } from 'rxjs';
import { ClientDuplexStream } from 'grpc';
import { ReverseCallRequestContext, ReverseCallResponseContext, ReverseCallArgumentsContext } from '@dolittle/runtime.contracts/Fundamentals/Services/ReverseCallContext_pb';

import { IExecutionContextManager } from '@dolittle/sdk.execution';
import { Logger } from 'winston';
import { IExecutionContextConverter } from 'IExecutionContextConverter';

/**
 * Represents an implementation of {IReverseCallClient}.
 */
export class ReverseCallClient<TClientMessage, TServerMessage, TConnectArguments, TConnectResponse, TRequest, TResponse> implements IReverseCallClient<TConnectArguments, TConnectResponse, TRequest, TResponse> {

    constructor(
        private _establishConnection: () => ClientDuplexStream<TClientMessage, TServerMessage>,
        private _messageConstructor: { new(): TClientMessage },
        private _setConnectArguments: (message: TClientMessage, connectArguments: TConnectArguments) => void,
        private _getConnectResponse: (message: TServerMessage) => TConnectResponse | undefined,
        private _getMessageRequest: (message: TServerMessage) => TRequest | undefined,
        private _setMessageResponse: (message: TClientMessage, reponse: TResponse) => void,
        private _setArgumentsContext: (connectArguments: TConnectArguments, context: ReverseCallArgumentsContext) => void,
        private _getRequestContext: (request: TRequest) => ReverseCallRequestContext | undefined,
        private _setResponseContext: (response: TResponse, context: ReverseCallResponseContext) => void,
        private _executionContextManager: IExecutionContextManager,
        private _executionContextConverter: IExecutionContextConverter,
        private _logger: Logger) {
    }

    /** @inheritdoc */
    connect(connectArguments: TConnectArguments, responseObserver: Observer<TConnectResponse>): Subscription {
        const streamingCall = this._establishConnection();

        const callContext = new ReverseCallArgumentsContext();
        const executionContext = this._executionContextConverter.toProtobuf(this._executionContextManager.current);
        callContext.setExecutioncontext(executionContext);
        this._setArgumentsContext(connectArguments, callContext);

        const clientMessage = new this._messageConstructor();
        this._setConnectArguments(clientMessage, connectArguments);

        const subject = new Subject<TConnectResponse>();
        const subscription = subject.subscribe(responseObserver);
        subscription.add(() => streamingCall.cancel());

        const errorHandler = (err: any) => {
            subject.error(err)
        };
        streamingCall.on('error', errorHandler);
        const endHandler = () => {
            subject.error('Stream ended before receiving connect response');
        };
        streamingCall.on('end', endHandler);

        streamingCall.once('data', (serverMessage: TServerMessage) => {
            streamingCall.off('error', errorHandler);
            streamingCall.off('end', endHandler);

            const response = this._getConnectResponse(serverMessage);
            if (response) {
                this._logger.debug('Received connect response');
                subject.next(response);
                subject.complete();
            }
        });

        streamingCall.write(clientMessage);
        return subscription;
    }

    /** @inheritdoc */
    handle(callback: OperatorFunction<TRequest, TResponse>): Subscription {
        throw new Error("Method not implemented.");
    }
    
}