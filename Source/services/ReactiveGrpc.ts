// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import * as grpc from 'grpc';
import { Observable, Subject } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import { UnaryMethod, ClientStreamMethod, ServerStreamMethod, DuplexMethod } from './GrpcMethods';
import { Cancellation } from './Cancellation';

/**
 * Performs a unary call.
 * @param {grpc.Client} client The Runtime client.
 * @param {UnaryMethod} method The method to call.
 * @param argument The argument to send to the server.
 * @param {Cancellation} cancellation Used to cancel the call.
 * @returns {Observable} The response from the server.
 */
export function reactiveUnary<TArgument, TResponse>(client: grpc.Client, method: UnaryMethod<TArgument, TResponse>, argument: TArgument, cancellation: Cancellation): Observable<TResponse> {
    const subject = new Subject<TResponse>();
    const call = method.call(client, argument, null, null, (error: grpc.ServiceError | null, message?: TResponse) => {
        if (error) {
            subject.error(error);
        }
 else {
            subject.next(message);
            subject.complete();
        }
    });
    handleCancellation(call, cancellation);
    return subject;
}

/**
 * Peforms a client streaming call.
 * @param {grpc.Client} client The Runtime client.
 * @param {ClientStreamMethod} method The method to call.
 * @param {Observable} requests The requests to send to the server.
 * @param {Cancellation} cancellation Used to cancel the call.
 * @returns {Observable} The response from the server.
 */
export function reactiveClientStream<TRequest, TResponse>(client: grpc.Client, method: ClientStreamMethod<TRequest, TResponse>, requests: Observable<TRequest>, cancellation: Cancellation): Observable<TResponse> {
    const subject = new Subject<TResponse>();
    const stream = method.call(client, null, null, (error: grpc.ServiceError | null, message?: TResponse) => {
        if (error) {
            subject.error(error);
        }
 else {
            subject.next(message);
            subject.complete();
        }
    });
    handleCancellation(stream, cancellation);
    handleClientRequests(stream, requests, subject);
    return subject;
}

/**
 * Performs a server streaming call.
 * @param {grpc.Client} client The Runtime client.
 * @param {ServerStreamMethod} method The method to call.
 * @param argument The argument to send to the server.
 * @param {Cancellation} cancellation Used to cancel the call.
 * @returns {Observable} The responses from the server.
 */
export function reactiveServerStream<TArgument, TResponse>(client: grpc.Client, method: ServerStreamMethod<TArgument, TResponse>, argument: TArgument, cancellation: Cancellation): Observable<TResponse> {
    const subject = new Subject<TResponse>();
    const stream = method.call(client, argument, null, null);
    handleCancellation(stream, cancellation);
    handleServerResponses(stream, subject);
    return subject;
}

/**
 * Performs a duplex streaming call.
 * @param {grpc.Client} client The Runtime client.
 * @param {DuplexMethod} method The method to call.
 * @param {Observable} requests The requests to send to the server.
 * @param {Cancellation} cancellation Used to cancel the call.
 * @returns {Observable} The responses from the server.
 */
export function reactiveDuplex<TRequest, TResponse>(client: grpc.Client, method: DuplexMethod<TRequest, TResponse>, requests: Observable<TRequest>, cancellation: Cancellation): Observable<TResponse> {
    const subject = new Subject<TResponse>();
    const stream = method.call(client, null, null);
    handleCancellation(stream, cancellation);
    handleClientRequests(stream, requests, subject);
    handleServerResponses(stream, subject);
    return subject;
}

function handleCancellation(call: grpc.Call, cancellation: Cancellation) {
    const subscription = cancellation.subscribe({
        complete: () => {
            call.cancel();
        }
    });
    call.on('end', () => {
        subscription.unsubscribe();
    });
}

function handleClientRequests<TRequest, TResponse>(stream: grpc.ClientWritableStream<TRequest>, requests: Observable<TRequest>, subject: Subject<TResponse>) {
    requests.pipe(concatMap((message: TRequest) => {
        const subject = new Subject<void>();
        stream.write(message, undefined, () => {
            subject.complete();
        });
        return subject;
    })).subscribe({
        complete: () => {
            stream.end();
        },
        error: (error: any) => {
            stream.cancel();
            subject.error(error);
        }
    });
}

function handleServerResponses<TResponse>(stream: grpc.ClientReadableStream<TResponse>, subject: Subject<TResponse>) {
    stream.on('data', (message: TResponse) => {
        subject.next(message);
    });
    stream.on('end', () => {
        subject.complete();
    });
    stream.on('error', (error: Error) => {
        subject.error(error);
    });
}
