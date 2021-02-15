// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

/**
 * Exception that is thrown when missing the aggregate root decorator for a type.
 */
export class MissingAggregateRootDecoratorFor extends Error {
    constructor(type: Constructor<any>) {
        super(`Missing aggregate root decorator for type '${type.name}'`);
    }
}
