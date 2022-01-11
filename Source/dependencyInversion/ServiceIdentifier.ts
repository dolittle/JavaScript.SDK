// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

/**
 * Represents a type that can be constructed.
 */
export type Newable<T> = new (...args: never[]) => T;

/**
 * Represents an abstract type.
 */
export type Abstract<T> = { prototype: T };

/**
 * Represents an identifier of a service.
 */
export type ServiceIdentifier<T> =
    Newable<T> |
    Abstract<T> |
    symbol |
    string;
