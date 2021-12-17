// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';

import { AggregateRootId } from '@dolittle/sdk.events';

import { AggregateRootType } from './AggregateRootType';
import { AggregateRootTypeMap } from './AggregateRootTypeMap';
import { IAggregateRootTypes } from './IAggregateRootTypes';

/**
 * Represents an implementation of {@link IAggregateRootTypes}.
 */
export class AggregateRootTypes extends IAggregateRootTypes {
    /**
     * Initialises a new instance of the {@link AggregateRootType} class.
     */
    constructor() {
        super(new AggregateRootTypeMap());
    }

    /** @inheritdoc */
    protected createArtifact(id: string | AggregateRootId | Guid): AggregateRootType {
        return new AggregateRootType(AggregateRootId.from(id));
    }

    /** @inheritdoc */
    protected getArtifactTypeName(): string {
        return 'AggregateRootType';
    }
}
