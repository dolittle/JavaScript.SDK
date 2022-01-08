// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

import { AnyIdentifier } from './Identifier';

/**
 * The exception that is thrown when attempting to unbind an identifier from a type that it is not bound to.
 */
export class CannotUnbindIdentifierFromTypeThatIsNotBound extends Exception {
    /**
     * Initialises a new instance of the {@link CannotUnbindIdentifierFromTypeThatIsNotBound} class.
     * @param {AnyIdentifier} identifier - The identifier that was attempted to unbind.
     * @param {Constructor} type - The type that was attempted to unbind from.
     */
    constructor(identifier: AnyIdentifier, type: Constructor<any>) {
        super(`Cannot unbind ${identifier} from ${type.name}. It was not bound`);
    }
}
