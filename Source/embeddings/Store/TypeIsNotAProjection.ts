// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

/**
 * Exception that gets thrown when trying to associate a type that isn't an embedding.
 */
export class TypeIsNotAEmbedding extends Exception {
    constructor(type: Constructor<any> | any) {
        super(`Type ${type.name} is not a embedding. Did you add the @embedding() decorator to the type?`);
    }
}
