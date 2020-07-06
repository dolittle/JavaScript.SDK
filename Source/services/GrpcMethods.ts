// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import * as grpc from 'grpc';

/**
 * Represents a unary gRPC method.
 */
export type UnaryMethod<TArgument, TResponse> = (argument: TArgument, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<TResponse>) => grpc.ClientUnaryCall;

/**
 * Represents a client streaming gRPC method.
 */
export type ClientStreamMethod<TRequest, TResponse> = (metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<TResponse>) => grpc.ClientWritableStream<TRequest>;

/**
 * Represents a server streaming gRPC method.
 */
export type ServerStreamMethod<TArgument, TResponse> = (argument: TArgument, metadata?: grpc.Metadata | null, options?: grpc.CallOptions | null) => grpc.ClientReadableStream<TResponse>;

/**
 * Represents a duplex streaming gRPC method.
 */
export type DuplexMethod<TRequest, TResponse> = (metadata?: grpc.Metadata | null, options?: grpc.CallOptions | null) => grpc.ClientDuplexStream<TRequest, TResponse>;
