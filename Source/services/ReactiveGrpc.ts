// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import * as grpc from '@grpc/grpc-js';
import { Observable, Subject } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import { Cancellation } from '@dolittle/sdk.resilience';

import { CouldNotConnectToRuntime } from './CouldNotConnectToRuntime';
import { ClientStreamMethod, DuplexMethod, ServerStreamMethod, UnaryMethod } from './GrpcMethods';
import { isGrpcError } from './GrpcError';

/**
 * Performs a unary call.
 * @param {grpc.Client} client - The Runtime client.
 * @param {UnaryMethod<TArgument, TResponse>} method - The method to call.
 * @param {TArgument} argument - The argument to send to the server.
 * @param {Cancellation} cancellation - Used to cancel the call.
 * @returns {Observable<TResponse>} The response from the server.
 * @template TArgument - The type of the argument.
 * @template TResponse - The type of the response.
 */
export function reactiveUnary<TArgument, TResponse>(client: grpc.Client, method: UnaryMethod<TArgument, TResponse>, argument: TArgument, cancellation: Cancellation): Observable<TResponse> {
    const subject = new Subject<TResponse>();
    const metadata = new grpc.Metadata();
    const call = method.call(client, argument, metadata, {}, (error: grpc.ServiceError | null, message?: TResponse) => {
        if (error) {
            subject.error(getErrorFrom(error, client.getChannel().getTarget()));
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
 * @param {grpc.Client} client - The Runtime client.
 * @param {ClientStreamMethod<TRequest, TResponse>} method - The method to call.
 * @param {Observable<TRequest>} requests - The requests to send to the server.
 * @param {Cancellation} cancellation - Used to cancel the call.
 * @returns {Observable<TResponse>} The response from the server.
 * @template TRequest - The type of the argument.
 * @template TResponse - The type of the response.
 */
export function reactiveClientStream<TRequest, TResponse>(client: grpc.Client, method: ClientStreamMethod<TRequest, TResponse>, requests: Observable<TRequest>, cancellation: Cancellation): Observable<TResponse> {
    const subject = new Subject<TResponse>();
    const metadata = new grpc.Metadata();
    const stream = method.call(client, metadata, {}, (error: grpc.ServiceError | null, message?: TResponse) => {
        if (error) {
            subject.error(getErrorFrom(error, client.getChannel().getTarget()));
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
 * @param {grpc.Client} client - The Runtime client.
 * @param {ServerStreamMethod<TArgument, TResponse>} method - The method to call.
 * @param {TArgument} argument - The argument to send to the server.
 * @param {Cancellation} cancellation - Used to cancel the call.
 * @returns {Observable<TResponse>} The responses from the server.
 * @template TArgument - The type of the argument.
 * @template TResponse - The type of the response.
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
 * @param {grpc.Client} client - The Runtime client.
 * @param {DuplexMethod<TRequest, TResponse>} method - The method to call.
 * @param {Observable<TRequest>} requests - The requests to send to the Runtime.
 * @param {Cancellation} cancellation - Used to cancel the call.
 * @returns {Observable<TResponse>} The responses from the Runtime and errors from the requests.
 * @template TRequest - The type of the argument.
 * @template TResponse - The type of the response.
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
 * @param {grpc.ClientWritableStream<TRequest>} stream - The stream between client and Runtime.
 * @param {Observable<TRequest>} requests - The requests to write to the Runtime.
 * @param {Subject<TResponse>} subject - The Subject which contains the responses from the Runtime.
 * @param {string} address - The address of the Runtime that was connected to.
 * @template TRequest - The type of the argument.
 * @template TResponse - The type of the response.
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
            subject.error(getErrorFrom(error, address));
        }
    });
}

/**
 * Handles the responses coming from the Runtime.
 * @param {grpc.ClientWritableStream} stream - The stream between client and Runtime.
 * @param {Subject} subject - The Subject to notify about the responses from the Runtime.
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

function getErrorFrom(error: any, address: string): any {
    if (isGrpcError(error) && error.code === grpc.status.UNAVAILABLE) {
        return new CouldNotConnectToRuntime(address);
    }
    return error;
}
