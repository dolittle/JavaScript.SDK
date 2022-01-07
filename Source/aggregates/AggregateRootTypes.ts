// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';

import { AggregateRootId } from '@dolittle/sdk.events';

import { AggregateRootType } from './AggregateRootType';
import { IAggregateRootTypes } from './IAggregateRootTypes';

/**
 * Represents an implementation of {@link IAggregateRootTypes}.
 */
export class AggregateRootTypes extends IAggregateRootTypes {
    /**
     * Initialises a new instance of the {@link AggregateRootTypes} class.
     */
    constructor() {
        super(AggregateRootType);
    }

    /** @inheritdoc */
    protected createArtifactFrom(id: string | AggregateRootId | Guid): AggregateRootType {
        return AggregateRootType.from(id);
    }
}
