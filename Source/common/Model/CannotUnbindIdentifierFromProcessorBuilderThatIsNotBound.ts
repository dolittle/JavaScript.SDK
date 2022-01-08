// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';

import { AnyIdentifier } from './Identifier';
import { ProcessorBuilder } from './ProcessorBuilder';

/**
 * The exception that is thrown when attempting to unbind an identifier from a processor builder that it is not bound to.
 */
export class CannotUnbindIdentifierFromProcessorBuilderThatIsNotBound extends Exception {
    /**
     * Initialises a new instance of the {@link CannotUnbindIdentifierFromProcessorBuilderThatIsNotBound} class.
     * @param {AnyIdentifier} identifier - The identifier that was attempted to unbind.
     * @param {ProcessorBuilder} processorBuilder - The type that was attempted to unbind from.
     */
    constructor(identifier: AnyIdentifier, processorBuilder: ProcessorBuilder) {
        super(`Cannot unbind ${identifier} from ${processorBuilder}. It was not bound`);
    }
}
