// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ConceptAs } from '@dolittle/concepts';

/**
 * Defines types that can be converted into a {@link ResourceName}.
 */
export type ResourceNameLike = string | ResourceName;

/**
 * Represents the name of a resource.
 */
export class ResourceName extends ConceptAs<string, '@dolittle/sdk.resources.ResourceName'> {
    /**
     * Initialises a new instance of the {@link ResourceName} class.
     * @param {string} name - The resource name.
     */
    constructor(name: string) {
        super(name, '@dolittle/sdk.resources.ResourceName');
    }

    /**
     * Creates an {@link ResourceName} from a string.
     * @param {ResourceNameLike} name - The name of the resource.
     * @returns {ResourceName} The resource name concept.
     */
    static from(name: ResourceNameLike): ResourceName {
        if (name instanceof ResourceName) return name;
        return new ResourceName(name);
    }
};
