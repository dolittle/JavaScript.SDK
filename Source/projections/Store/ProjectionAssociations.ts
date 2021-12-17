// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

import { IProjectionAssociations } from './IProjectionAssociations';
import { NoProjectionAssociatedWithType } from './NoProjectionAssociatedWithType';
import { ProjectionAssociation } from './ProjectionAssociation';

/**
 * Represents an implementation of {@link IProjectionAssociations}.
 */
export class ProjectionAssociations extends IProjectionAssociations {
    /**
     * Initialises a new instance of the {@link ProjectionAssociations} class.
     * @param {Map<Constructor<any>, ProjectionAssociation>} _associations - The associatons.
     */
    constructor(private readonly _associations: Map<Constructor<any>, ProjectionAssociation>) {
        super();
    }

    /** @inheritdoc */
    hasFor<T>(type: Constructor<T>): boolean {
        return this._associations.has(type);
    }

    /** @inheritdoc */
    getFor<T>(type: Constructor<T>): ProjectionAssociation {
        if (!this._associations.has(type)) {
            throw new NoProjectionAssociatedWithType(type);
        }
        return this._associations.get(type)!;
    }
}
