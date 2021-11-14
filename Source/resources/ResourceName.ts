// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ConceptAs } from '@dolittle/concepts';

export type ResourceNameLike = string | ResourceName;

/**
 * Represents the name of a resource.
 *
 * @export
 * @class ResourceName
 * @extends {ConceptAs<string, '@dolittle/sdk.resources.ResourceName'>}
 */
export class ResourceName extends ConceptAs<string, '@dolittle/sdk.resources.ResourceName'> {
    constructor(name: string) {
        super(name, '@dolittle/sdk.resources.ResourceName');
    }
    /**
     * Creates an {@link ResourceName} from a string.
     *
     * @static
     * @param {ResourceNameLike} name
     * @returns {ResourceName}
     */
    static from(name: ResourceNameLike): ResourceName {
        if (name instanceof ResourceName) return name;
        return new ResourceName(name);
    }
};
