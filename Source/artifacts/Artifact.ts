// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { Generation } from './Generation';

export type ArtifactIdLike = { value: Guid };

/**
 * Represents the base representation of an Artifact.
 *
 * @export
 * @class Artifact
 */
export abstract class Artifact<TId extends ArtifactIdLike> {

    /**
     * Initializes a new instance of {@link EventType}
     * @param {EventTypeId} id The unique identifier of the artifact.
     * @param {Generation} [generation] Optional generation - will default to {@link generation.first}
     */
    constructor(readonly id: TId, readonly generation: Generation = Generation.first) {
    }

    /** @inheritdoc */
    abstract toString(): string;
}
