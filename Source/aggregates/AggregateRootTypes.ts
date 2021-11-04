// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';
import { ArtifactOrId } from '@dolittle/sdk.artifacts';
import { AggregateRootId } from '@dolittle/sdk.events';
import { AggregateRootType } from './AggregateRootType';
import { AggregateRootTypeMap } from './AggregateRootTypeMap';
import { IAggregateRootTypes } from './IAggregateRootTypes';

/**
 * Represents an implementation of {@link IAggregateRootTypes}
 */
export class AggregateRootTypes extends IAggregateRootTypes {
    /**
     * Initializes a new instance of {@link AggregateRootType}
     * @param {AggregateRootTypeMap<Constructor<any>>} [associations] Known associations
     */
    constructor(associations: AggregateRootTypeMap<Constructor<any>> = new AggregateRootTypeMap()) {
        super(associations);
    }

    /** @inheritdoc */
    protected createArtifact(artifactOrId: ArtifactOrId<AggregateRootType, AggregateRootId>): AggregateRootType {
        return artifactOrId instanceof AggregateRootType
                ? artifactOrId
                : new AggregateRootType(AggregateRootId.from(artifactOrId));
    }

    /** @inheritdoc */
    protected getArtifactTypeName(): string {
        return 'AggregateRootType';
    }
}
