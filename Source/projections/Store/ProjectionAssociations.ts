// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ScopeId } from '@dolittle/sdk.events';
import { Constructor } from '@dolittle/types';
import { ProjectionId } from '../ProjectionId';
import { ProjectionAssociation } from './ProjectionAssociation';

export class ProjectionAssociations {
    readonly _associationsToType: Map<ProjectionAssociation, Constructor<any>> = new Map();
    readonly _typeToAssociations: Map<Constructor<any>, ProjectionAssociation> = new Map();

    associate<T>(type: Constructor<T>): void;
    associate<T>(type: Constructor<T>, projection: ProjectionId | undefined, scope: ScopeId | undefined): void {
        if (projection && scope) {
            
        } else {

        }
    }
}
