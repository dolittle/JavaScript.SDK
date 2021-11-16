// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

/**
 * Exception that is thrown aggregate root decorator is not found for a type.
 */
export class MissingAggregateRootDecoratorFor extends Error {
    /**
     * Initialises a new instance of the {@link MissingAggregateRootDecoratorFor} class.
     * @param {Constructor<any>} type - The type that is missing the decorator.
     */
    constructor(type: Constructor<any>) {
        super(`Missing aggregate root decorator for type '${type.name}'`);
    }
}
