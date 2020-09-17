// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ArtifactsFromDecorators, ArtifactId, Generation } from '@dolittle/sdk.artifacts';
import { Guid } from '@dolittle/rudiments';

/**
 * Decorator for associating an event with an artifact.
 */
export function eventType(identifier: Guid | string, generationNumber?: number) {
    return function (target: any) {
        ArtifactsFromDecorators.associate(
            target.prototype.constructor,
            ArtifactId.from(identifier),
            generationNumber != null ? Generation.from(generationNumber) : Generation.first);
    };
}
