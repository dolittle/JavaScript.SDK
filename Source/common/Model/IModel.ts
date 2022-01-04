// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IEquatable } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

import { Identifier } from './Identifier';
import { Processor } from './Processor';

type Binding = {
    identifier: Identifier;
    type?: Constructor<any>;
    processor?: Processor;
};

type TypeBinding<T> = {
    identifier: T;
    type: Constructor<any>;
};

/**
 * Defines a Dolittle application model.
 */
export abstract class IModel {
    /**
     * Gets the valid bindings.
     */
    abstract get bindings(): readonly Binding[];

    /**
     * Gets the bindings for a specific kind of identifier to types.
     * @param {(any) => boolean} predicate - The type predicate to determine the kind of the identifier.
     */
    abstract getTypeBindings<T>(predicate: (identifier: any) => identifier is T): readonly TypeBinding<T>[];
}
