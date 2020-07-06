// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Observer, Subscription, OperatorFunction } from 'rxjs';

/**
 * Defines a client for reverse calls coming from the server to the client.
 */
export interface IReverseCallClient<TConnectArguments, TConnectResponse, TRequest, TResponse> {
    /**
     * Connects to the server.
     * @param {TConnectArguments} connectArguments The connection arguments to send to the server.
     * @param {Observer<TConnectResponse>} responseObserver The observer that will be called with the connect response received from the server.
     * @returns {Subscription} The subscription that represents the call to the server.
     */
    connect(connectArguments: TConnectArguments, responseObserver: Observer<TConnectResponse>): Subscription;

    /**
     * Starts the handling of calls from the server.
     * @param {OperatorFunction<TRequest,TResponse>} callback The callback that will be called to handle incoming requests.
     * @returns {Subscription} The subscription that represents the connection to the server.
     */
    handle(callback: OperatorFunction<TRequest, TResponse>): Subscription;
}
