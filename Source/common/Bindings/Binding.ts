// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

/**
 * Represents a binding between an identifier and a value.
 * @template TIdentifier The type of the identifier.
 * @template TValue The type of the value.
 */
export type Binding<TIdentifier, TValue> = {
    identifier: TIdentifier;
    value: TValue;
};
