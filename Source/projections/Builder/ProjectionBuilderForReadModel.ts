// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { Guid } from '@dolittle/rudiments';
import { IContainer } from '@dolittle/sdk.common';
import { EventType, EventTypeId, EventTypeMap, Generation, IEventTypes, ScopeId } from '@dolittle/sdk.events';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { Cancellation } from '@dolittle/sdk.resilience';
import { Constructor } from '@dolittle/types';

import { ProjectionsClient } from '@dolittle/runtime.contracts/Events.Processing/Projections_grpc_pb';

import { IProjections, KeySelector, Projection, ProjectionCallback, ProjectionId } from '..';
import { ProjectionProcessor } from '../Internal';

import { ICanBuildAndRegisterAProjection } from './ICanBuildAndRegisterAProjection';
import { KeySelectorBuilder } from './KeySelectorBuilder';
import { OnMethodBuilder } from './OnMethodBuilder';
import { TypeOrEventType } from './TypeOrEventType';


/**
 * Represents a builder for building {@link IProjection}.
 */
export class ProjectionBuilderForReadModel<T> extends OnMethodBuilder<T> implements ICanBuildAndRegisterAProjection {

    /**
     * Initializes a new instance of {@link ProjectionBuilder}.
     * @param {ProjectionId} _projectionId  The unique identifier of the projection to build for
     */
    constructor(
        private _projectionId: ProjectionId,
        private _readModelTypeOrInstance: Constructor<T> | T,
        private _scopeId: ScopeId) {
            super();
        }

    /**
     * Defines the projection to operate in a specific {@link ScopeId}.
     * @param {ScopeId | Guid | string} scopeId Scope the projection operates in.
     * @returns {ProjectionBuilderForReadModel<T>}
     */
    inScope(scopeId: ScopeId | Guid | string): ProjectionBuilderForReadModel<T> {
        this._scopeId = ScopeId.from(scopeId);
        return this;
    }

    /** @inheritdoc */
    buildAndRegister(
        client: ProjectionsClient,
        projections: IProjections,
        container: IContainer,
        executionContext: ExecutionContext,
        eventTypes: IEventTypes,
        logger: Logger,
        cancellation: Cancellation): void {

        const events = new EventTypeMap<[ProjectionCallback<T>, KeySelector]>();
        if (this.onMethods.length < 1) {
            logger.warn(`Failed to register projection ${this._projectionId}. No on methods are configured`);
            return;
        }
        const allMethodsBuilt = this.tryAddOnMethods(eventTypes, events);
        if (!allMethodsBuilt) {
            logger.warn(`Failed to register projection ${this._projectionId}. Could not build projection. Maybe it tries to handle the same type of event twice?`);
            return;
        }
        const projection = new Projection<T>(this._projectionId, this._readModelTypeOrInstance, this._scopeId, events);
        projections.register<T>(
            new ProjectionProcessor<T>(
                projection,
                client,
                executionContext,
                eventTypes,
                logger
            ), cancellation);
    }

}
