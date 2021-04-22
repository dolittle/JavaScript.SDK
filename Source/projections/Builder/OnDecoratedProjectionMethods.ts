// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { EventTypeId } from '@dolittle/sdk.events';
import { Constructor } from '@dolittle/types';
import { KeySelector } from '..';
import { OnDecoratedProjectionMethod } from './OnDecoratedProjectionMethod';
import { ProjectionClassOnMethod } from './ProjectionClassOnMethod';

/**
 * Defines the system that knows about all the methods decorated with the on decorator on a projection.
 */
export class OnDecoratedProjectionMethods {
    /**
     * All on methods grouped by their projection.
     */
    static readonly methodsPerProjection: Map<Function, OnDecoratedProjectionMethod[]> = new Map();

    /**
     * Registers on decorated projection methods
     * @param {Constructor<any>} target Target that owns the on method.
     * @param {Constructor<any> | EventTypeId | Guid | string} eventTypeOrId Type or event type id of event the on method is for or the event.
     * @param {number | undefined} generation Generation of event type or undefined.
     * @param {KeySelector} keySelector The key selector to use for this event type.
     * @param {ProjectionClassOnMethod} method The method that handles the event.
     * @param {string} name The name of the method.
     */
    static register(
        target: Constructor<any>,
        eventTypeOrId: Constructor<any> | EventTypeId | Guid | string,
        generation: number | undefined,
        keySelector: KeySelector,
        method: ProjectionClassOnMethod,
        name: string): void {
        let methods = this.methodsPerProjection.get(target);
        if (!methods) {
            this.methodsPerProjection.set(target, methods = []);
        }
        methods.push(new OnDecoratedProjectionMethod(target, eventTypeOrId, generation, keySelector, method, name));
    }
}
