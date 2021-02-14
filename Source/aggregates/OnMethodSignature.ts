// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

/**
 * Represents the signature for an on method.
 */
export type OnMethodSignature<T = any> = (event: T) => void | Promise<void>;
