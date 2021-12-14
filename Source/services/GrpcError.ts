// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import * as grpc from '@grpc/grpc-js';

/**
 * Defines an error thrown from the gRPC library.
 */
export interface GrpcError extends Error, grpc.StatusObject {}

/**
 * Checks whether the given error is a {@link GrpcError} or not.
 * @param {any} error - The error to check.
 * @returns {boolean} True if the error is a {@link GrpcError}, false if not.
 */
export function isGrpcError(error: any): error is GrpcError {
    if (typeof error.code !== 'number') return false;
    if (typeof error.details !== 'string') return false;
    if (!(error.metadata instanceof grpc.Metadata)) return false;
    if (!(error instanceof Error)) return false;

    return true;
}
