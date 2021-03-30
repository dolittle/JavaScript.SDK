// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';
import { ProjectionId } from '../';

/**
 * Exception that is thrown when you try to register a readmodel for a projection when its already defined.
 */
export class ReadModelAlreadyDefinedForProjection extends Exception {
    constructor(projectionId: ProjectionId, newReadModel: Constructor<any> | any, oldReadModel: Constructor<any> | any) {
        super(`You tried to register the readmodel ${newReadModel} to projection ${projectionId}, when it already had a read model defined to it: ${oldReadModel}`);
    }
}
