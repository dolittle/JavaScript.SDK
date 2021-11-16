// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Cancellation } from '@dolittle/sdk.resilience';
import * as grpc from '@grpc/grpc-js';
import { Observable, Subject } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { CouldNotConnectToRuntime } from './CouldNotConnectToRuntime';
import { ClientStreamMethod, DuplexMethod, ServerStreamMethod, UnaryMethod } from './GrpcMethods';

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
    const metadata = new grpc.Metadata();
    const call = method.call(client, argument, metadata, {}, (error: grpc.ServiceError | null, message?: TResponse) => {
        if (error) {
            subject.error(getErrorFromGrpc(error, client.getChannel().getTarget()));
        } else {
            subject.next(message);
            subject.complete();
        }
    });
    handleCancellation(call, cancellation);
    return subject;
}

/**
 * Performs a client streaming call.
 * @param {grpc.Client} client The Runtime client.
 * @param {ClientStreamMethod} method The method to call.
 * @param {Observable} requests The requests to send to the server.
 * @param {Cancellation} cancellation Used to cancel the call.
 * @returns {Observable} The response from the server.
 */
export function reactiveClientStream<TRequest, TResponse>(client: grpc.Client, method: ClientStreamMethod<TRequest, TResponse>, requests: Observable<TRequest>, cancellation: Cancellation): Observable<TResponse> {
    const subject = new Subject<TResponse>();
    const metadata = new grpc.Metadata();
    const stream = method.call(client, metadata, {}, (error: grpc.ServiceError | null, message?: TResponse) => {
        if (error) {
            subject.error(getErrorFromGrpc(error, client.getChannel().getTarget()));
        } else {
            subject.next(message);
            subject.complete();
        }
    });
    handleCancellation(stream, cancellation);
    handleClientRequests(stream, requests, subject, client.getChannel().getTarget());
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
 * Performs a duplex streaming call between the client and the Runtime.
 * @param {grpc.Client} client The Runtime client.
 * @param {DuplexMethod} method The method to call.
 * @param {Observable} requests The requests to send to the Runtime.
 * @param {Cancellation} cancellation Used to cancel the call.
 * @returns {Observable} The responses from the Runtime and errors from the requests.
 */
export function reactiveDuplex<TRequest, TResponse>(client: grpc.Client, method: DuplexMethod<TRequest, TResponse>, requests: Observable<TRequest>, cancellation: Cancellation): Observable<TResponse> {
    const subject = new Subject<TResponse>();
    const metadata = new grpc.Metadata();
    const stream = method.call(client, metadata, {});
    handleCancellation(stream, cancellation);
    handleClientRequests(stream, requests, subject, client.getChannel().getTarget());
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

/**
 * Handles writing requests to the Runtime. If the request error, it cancels the stream and errors the
 * subject containing the responses from the Runtime.
 * @param {grpc.ClientWritableStream} stream The stream between client and Runtime.
 * @param {Observable} requests The requests to write to the Runtime.
 * @param {Subject} subject The Subject which contains the responses from the Runtime.
 */
function handleClientRequests<TRequest, TResponse>(stream: grpc.ClientWritableStream<TRequest>, requests: Observable<TRequest>, subject: Subject<TResponse>, address: string) {
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
            if (isGrpcError(error)) {
                error = getErrorFromGrpc(error, address);
            }
            subject.error(error);
        }
    });
}

/**
 * Handles the responses coming from the Runtime.
 * @param {grpc.ClientWritableStream} stream The stream between client and Runtime.
 * @param {Subject} subject The Subject to notify about the responses from the Runtime.
 */
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

function getErrorFromGrpc(error: grpc.ServiceError, address: string) {
    if (error.code === grpc.status.UNAVAILABLE) {
        return new CouldNotConnectToRuntime(address);
    } else {
        return error;
    }
}

function isGrpcError(error: any): error is grpc.ServiceError {
    return error.code !== undefined;
}
