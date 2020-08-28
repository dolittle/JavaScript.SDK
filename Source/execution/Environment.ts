// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ConceptAs } from '@dolittle/concepts';

/**
 * Represents the unique identifier of a tenant.
 */
export class Environment extends ConceptAs<string, '@dolittle/sdk.execution.Environment'> {
    constructor(env: string) {
        super(env, '@dolittle/sdk.execution.Environment');
    }

    /**
     * Represents an undetermined environment
     */
    static undetermined: Environment = Environment.from('Undetermined');

    /**
     * Represents an production environment
     */
    static production: Environment = Environment.from('Production');

    /**
     * Represents an development environment
     */
    static development: Environment = Environment.from('Development');

    static from(env: string): Environment {
        return new Environment(env);
    };
}
