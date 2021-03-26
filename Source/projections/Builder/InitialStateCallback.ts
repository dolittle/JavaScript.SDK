// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

/**
 * Represents the signature for a initial state callback.
 */
export type InitialStateCallback<T> = (state: T) => T;
