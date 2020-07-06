// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import * as grpc from 'grpc';
import { Observable, Subject } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import { IReactiveGrpc } from 'IReactiveGrpc';
import { UnaryMethod, ClientStreamMethod, ServerStreamMethod, DuplexMethod } from 'GrpcMethods';
import { Cancellation } from 'Cancellation';

/**
 * Represents an implementation of {@link IReactiveGrpc}.
 */
export class ReactiveGrpc implements IReactiveGrpc {
    /** @inheritdoc */
    performUnary<TArgument, TResponse>(method: UnaryMethod<TArgument, TResponse>, argument: TArgument, cancellation: Cancellation): Observable<TResponse> {
        const subject = new Subject<TResponse>();
        const call = method(argument, null, null, (error: grpc.ServiceError | null, message?: TResponse) => {
            if (error) {
                subject.error(error);
            } else {
                subject.next(message);
                subject.complete();
            }
        });
        this.handleCancellation(call, cancellation);
        return subject;
    }

    /** @inheritdoc */
    performClientStream<TRequest, TResponse>(method: ClientStreamMethod<TRequest, TResponse>, requests: Observable<TRequest>, cancellation: Cancellation): Observable<TResponse> {
        const subject = new Subject<TResponse>();
        const stream = method(null, null, (error: grpc.ServiceError | null, message?: TResponse) => {
            if (error) {
                subject.error(error);
            } else {
                subject.next(message);
                subject.complete();
            }
        });
        this.handleCancellation(stream, cancellation);
        this.handleClientRequests(stream, requests, subject);
        return subject;
    }

    /** @inheritdoc */
    performServerStream<TArgument, TResponse>(method: ServerStreamMethod<TArgument, TResponse>, argument: TArgument, cancellation: Cancellation): Observable<TResponse> {
        const subject = new Subject<TResponse>();
        const stream = method(argument, null, null);
        this.handleCancellation(stream, cancellation);
        this.handleServerResponses(stream, subject);
        return subject;
    }

    /** @inheritdoc */
    performDuplex<TRequest, TResponse>(method: DuplexMethod<TRequest, TResponse>, requests: Observable<TRequest>, cancellation: Cancellation): Observable<TResponse> {
        const subject = new Subject<TResponse>();
        const stream = method(null, null);
        this.handleCancellation(stream, cancellation);
        this.handleClientRequests(stream, requests, subject);
        this.handleServerResponses(stream, subject);
        return subject;
    }

    private handleCancellation(call: grpc.Call, cancellation: Cancellation) {
        const subscription = cancellation.subscribe({
            complete: () => {
                call.cancel();
            }
        });
        call.on('end', () => {
            subscription.unsubscribe();
        });
    }

    private handleClientRequests<TRequest, TResponse>(stream: grpc.ClientWritableStream<TRequest>, requests: Observable<TRequest>, subject: Subject<TResponse>) {
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
                subject.error(error);
            }
        });
    }

    private handleServerResponses<TResponse>(stream: grpc.ClientReadableStream<TResponse>, subject: Subject<TResponse>) {
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
}
