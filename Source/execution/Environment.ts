// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ConceptAs } from '@dolittle/concepts';

/**
 * Represents the unique identifier of a tenant.
 */
export class Environment extends ConceptAs<string, '@dolittle/sdk.execution.Environment'> {
    constructor(id: string) {
        super(id, '@dolittle/sdk.execution.Environment');
    }

    /**
     * Represents an undetermined environment
     */
    static undetermined: Environment = Environment.create('Undetermined');

    /**
     * Represents an production environment
     */
    static production: Environment = Environment.create('Production');

    /**
     * Represents an development environment
     */
    static development: Environment = Environment.create('Development');

    static create(env: string): Environment {
        return env != null ? new Environment(env) : Environment.undetermined;
    };
}
