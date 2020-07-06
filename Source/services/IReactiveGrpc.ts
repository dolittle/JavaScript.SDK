// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Observable } from 'rxjs';

import { UnaryMethod, ClientStreamMethod, ServerStreamMethod, DuplexMethod } from 'GrpcMethods';
import { Cancellation } from 'Cancellation';

/**
 * Defines a system for making gRPC calls using {@link Observable}.
 */
export interface IReactiveGrpc {
    /**
     * Performs a unary call.
     * @param {UnaryMethod} method The method to call.
     * @param argument The argument to send to the server.
     * @param {Cancellation} cancellation Used to cancel the call.
     * @returns {Observable} The response from the server.
     */
    performUnary<TArgument, TResponse>(method: UnaryMethod<TArgument, TResponse>, argument: TArgument, cancellation: Cancellation): Observable<TResponse>;

    /**
     * Peforms a client streaming call.
     * @param {ClientStreamMethod} method The method to call.
     * @param {Observable} requests The requests to send to the server.
     * @param {Cancellation} cancellation Used to cancel the call.
     * @returns {Observable} The response from the server.
     */
    performClientStream<TRequest, TResponse>(method: ClientStreamMethod<TRequest, TResponse>, requests: Observable<TRequest>, cancellation: Cancellation): Observable<TResponse>;

    /**
     * Performs a server streaming call.
     * @param {ServerStreamMethod} method The method to call.
     * @param argument The argument to send to the server.
     * @param {Cancellation} cancellation Used to cancel the call.
     * @returns {Observable} The responses from the server.
     */
    performServerStream<TArgument, TResponse>(method: ServerStreamMethod<TArgument, TResponse>, argument: TArgument, cancellation: Cancellation): Observable<TResponse>;

    /**
     * Performs a duplex streaming call.
     * @param {DuplexMethod} method The method to call.
     * @param {Observable} requests The requests to send to the server.
     * @param {Cancellation} cancellation Used to cancel the call.
     * @returns {Observable} The responses from the server.
     */
    performDuplex<TRequest, TResponse>(method: DuplexMethod<TRequest, TResponse>, requests: Observable<TRequest>, cancellation: Cancellation): Observable<TResponse>;
}
