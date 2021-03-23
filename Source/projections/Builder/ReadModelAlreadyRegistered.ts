// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';
import { ProjectionDecoratedType } from './ProjectionDecoratedType';

/**
 * Exception that is thrown when you try to register a projection for a readmodel that already has a projection for it
 */
export class ReadModelAlreadyRegistered extends Exception {
    constructor(readModel: Constructor<any>, duplicateTypes: ProjectionDecoratedType[]) {
        const projections = duplicateTypes.map(type => type.projectionId);
        super(`The readmodel ${readModel} is registered to multiple projections: ${projections}`);
    }
}
