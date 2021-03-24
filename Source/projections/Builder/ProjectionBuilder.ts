// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { EventType, EventTypeId, EventTypeMap, Generation, IEventTypes } from '@dolittle/sdk.artifacts';
import { Guid } from '@dolittle/rudiments';
import { ScopeId } from '@dolittle/sdk.events';
import { Constructor } from '@dolittle/types';
// import { ProjectionsClient } from '@dolittle/runtime.contracts/Runtime/Projections/Projections_grpc_pb';
type ProjectionsClient = any;

import { ProjectionId } from '../ProjectionId';
import { ProjectionSignature } from '../ProjectionSignature';
import { ICanBuildAndRegisterAProjection } from './ICanBuildAndRegisterAProjection';
import { Cancellation } from '@dolittle/sdk.resilience';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { IContainer } from '@dolittle/sdk.common';
import { Projection } from '../Projection';
import { IProjections } from '../IProjections';
import { ReadModelAlreadyDefinedForProjection } from './ReadModelAlreadyDefinedForProjection';

type TypeOrEventType = Constructor<any> | EventType;
type TypeToMethodPair = [TypeOrEventType, ProjectionSignature<any>];

export class ProjectionBuilder implements ICanBuildAndRegisterAProjection {
    private _scopeId: ScopeId = ScopeId.default;
    private _readModel: Constructor<any> | undefined;
    private _typeToMethodPairs: TypeToMethodPair[] = [];

    /**
     * Initializes a new instance of {@link ProjectionBuilder}.
     * @param {ProjectionId} _projectionId  The unique identifier of the projection to build for
     */
    constructor(private _projectionId: ProjectionId) { }

    /**
     * Defines the projection to operate on a specific {@link ScopeId}.
     * @param {ScopeId | Guid | string} scopeId Scope the projection operates on.
     * @returns {ProjectionBuilder}
     */
    inScope(scopeId: ScopeId | Guid | string): ProjectionBuilder {
        this._scopeId = ScopeId.from(scopeId);
        return this;
    }

    /**
     * Defines which readmodel to build a projection for.
     * @param {Constructor<T>} readModelType The type of the read model.
     * @returns {ProjectionBuilder}
     */
    forReadModel<T = any>(readModelType: Constructor<T>): ProjectionBuilder {
        if (this._readModel) {
            throw new ReadModelAlreadyDefinedForProjection(this._projectionId, readModelType, this._readModel);
        }
        this._readModel = readModelType;
        return this;
    }

    /**
     * Add an on method for handling the event.
     * @template T Type of event.
     * @param {Constructor<T>} type The type of event.
     * @param {ProjectionSignature<T>} method Method to call for each event.
     */
    on<T>(type: Constructor<T>, method: ProjectionSignature<T>): void;
    /**
     * Add an on method for handling the event.
     * @param {EventType} eventType The identifier of the event.
     * @param {ProjectionSignature<T>} method Method to call for each event.
     */
    on(eventType: EventType, method: ProjectionSignature): void;
    /**
     * Add an on method for handling the event.
     * @param {EventTypeId|Guid|string} eventType The identifier of the event.
     * @param {ProjectionSignature<T>} method Method to call for each event.
     */
    on(eventTypeId: EventTypeId | Guid | string, method: ProjectionSignature): void;
    /**
     * Add an on method for handling the event.
     * @param {EventTypeId | Guid | string} eventType The identifier of the event.
     * @param {Generation | number} generation The generation of the event type.
     * @param {ProjectionSignature<T>} method Method to call for each event.
     */
    on(eventTypeId: EventTypeId | Guid | string, generation: Generation | number, method: ProjectionSignature): void;
    on<T = any>(typeOrEventTypeOrId: Constructor<T> | EventType | EventTypeId | Guid | string,
        methodOrGeneration: ProjectionSignature<T> | Generation | number,
        maybeMethod?: ProjectionSignature<T>) {
        const method = maybeMethod || methodOrGeneration as ProjectionSignature<T>;

        if (typeOrEventTypeOrId instanceof EventType) {
            this._typeToMethodPairs.push([typeOrEventTypeOrId, method]);
        } else if (typeOrEventTypeOrId instanceof EventTypeId || typeOrEventTypeOrId instanceof Guid || typeof typeOrEventTypeOrId === 'string') {
            let generation = Generation.first;
            if (methodOrGeneration instanceof Generation || typeof methodOrGeneration === 'number') {
                generation = Generation.from(methodOrGeneration);
            }
            this._typeToMethodPairs.push([new EventType(EventTypeId.from(typeOrEventTypeOrId), generation), method]);
        } else {
            this._typeToMethodPairs.push([typeOrEventTypeOrId, method]);
        }
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
        if (!this._readModel) {
            logger.warn(`No read model defined for projection ${this._projectionId}`);
            return;
        }
        const eventTypeToMethods = new EventTypeMap<ProjectionSignature<any>>();
        if (this._typeToMethodPairs.length < 1) {
            logger.warn(`Failed to projection ${this._projectionId}. No on methods are configured for the projection`);
            return;
        }
        const allMethodsBuilt = this.tryAddProjectionMethods(eventTypes, eventTypeToMethods, logger);
        if (!allMethodsBuilt) {
            logger.warn(`Could not build projection ${this._projectionId}`);
            return;
        }
        const projection = new Projection(this._projectionId, this._readModel, this._scopeId, eventTypeToMethods);
        /*
        projections.register(
            new internal.ProjectionProcessor(
                eventHandler,
                client,
                executionContext,
                eventTypes,
                logger
            ), cancellation);
        */
    }


    private tryAddProjectionMethods(
        eventTypes: IEventTypes,
        eventTypeToMethods: EventTypeMap<ProjectionSignature<any>>,
        logger: Logger): boolean {
        let allMethodsValid = true;
        for (const [typeOrEventTypeOrId, method] of this._typeToMethodPairs){
            const eventType = this.getEventType(typeOrEventTypeOrId, eventTypes);
            if (eventTypeToMethods.has(eventType)) {
                allMethodsValid = false;
                logger.warn(`Projection ${this._projectionId} already handles event with event type ${eventType}`);
            }
            eventTypeToMethods.set(eventType, method);
        }
        return allMethodsValid;
    }

    private getEventType(typeOrEventTypeOrId: TypeOrEventType, eventTypes: IEventTypes): EventType {
        let eventType: EventType;
        if (typeOrEventTypeOrId instanceof EventType) {
            eventType = typeOrEventTypeOrId;
        } else {
            eventType = eventTypes.getFor(typeOrEventTypeOrId);
        }
        return eventType;
    }
}
