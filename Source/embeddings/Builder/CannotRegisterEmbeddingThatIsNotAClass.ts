// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';

/**
 * Exception that gets thrown when attempting to register a embedding by instance, that is not a class.
 */
export class CannotRegisterEmbeddingThatIsNotAClass extends Exception {
    /**
     * Creates an instance of CannotRegisterEmbeddingThatIsNotAClass.
     * @param {any} instance - The instance of the embedding that is not class.
     */
    constructor(instance: any) {
        super(`Embedding instance ${instance} is not a class`);
    }
}
