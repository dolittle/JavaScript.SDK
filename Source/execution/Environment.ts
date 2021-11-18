// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ConceptAs } from '@dolittle/concepts';

/**
 * Represents the unique identifier of a tenant.
 */
export class Environment extends ConceptAs<string, '@dolittle/sdk.execution.Environment'> {
    /**
     * Initialises a new instance of the {@link Environment} class.
     * @param {string} env - The environment.
     */
    constructor(env: string) {
        super(env, '@dolittle/sdk.execution.Environment');
    }

    /**
     * Represents an undetermined environment.
     */
    static undetermined: Environment = Environment.from('Undetermined');

    /**
     * Represents an production environment.
     */
    static production: Environment = Environment.from('Production');

    /**
     * Represents an development environment.
     */
    static development: Environment = Environment.from('Development');

    /**
     * Creates an {@link Environment} from a {@link string}.
     * @param {Environment | string} env - The environment.
     * @returns {Environment} The created environement concept.
     */
    static from(env: Environment | string): Environment {
        if (env instanceof Environment) return env;
        return new Environment(env);
    };
}
