// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { ProjectionsClient } from '@dolittle/runtime.contracts/Events.Processing/Projections_grpc_pb';
import { EventType, EventTypeId, Generation } from '@dolittle/sdk.artifacts';
import { IContainer } from '@dolittle/sdk.common';
import { EventTypeMap, IEventTypes, ScopeId } from '@dolittle/sdk.events';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { Cancellation } from '@dolittle/sdk.resilience';
import { Constructor } from '@dolittle/types';
import { Logger } from 'winston';
import { IProjections, KeySelector, Projection, ProjectionCallback, ProjectionId } from '..';
import { ProjectionProcessor } from '../Internal';
import { ICanBuildAndRegisterAProjection } from './ICanBuildAndRegisterAProjection';
import { KeySelectorBuilder } from './KeySelectorBuilder';
import { KeySelectorBuilderCallback } from './KeySelectorBuilderCallback';
import { OnMethodBuilder } from './OnMethodBuilder';
import { OnMethodSpecification } from './OnMethodSpecification';
import { TypeOrEventType } from './TypeOrEventType';

/**
 * Represents a builder for building {@link IProjection}.
 */
export class ProjectionBuilderForReadModel<T> implements ICanBuildAndRegisterAProjection {
    private onMethods: OnMethodSpecification<T>[] = [];

    /**
     * Initializes a new instance of {@link ProjectionBuilder}.
     * @param {ProjectionId} _projectionId  The unique identifier of the projection to build for
     */
    constructor(
        private _projectionId: ProjectionId,
        private _readModelTypeOrInstance: Constructor<T> | T,
        private _scopeId: ScopeId) {
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

    /**
     * Add an on method for handling the event.
     * @template TEvent Type of event.
     * @param {Constructor<TEvent>} type The type of event.
     * @param {KeySelectorBuilderCallback<TEvent>} keySelectorCallback Callback for building key selector.
     * @param {ProjectionCallback<T, TEvent>} callback Callback to call for each event.
     * @returns {ProjectionBuilderForReadModel<T>}
     */
    on<TEvent>(type: Constructor<TEvent>, keySelectorCallback: KeySelectorBuilderCallback<TEvent>, callback: ProjectionCallback<T, TEvent>): this;
    /**
     * Add an on method for handling the event.
     * @param {EventType} eventType The identifier of the event.
     * @param {KeySelectorBuilderCallback} keySelectorCallback Callback for building key selector.
     * @param {ProjectionCallback<T>} callback Callback to call for each event.
     * @returns {ProjectionBuilderForReadModel<T>}
     */
    on(eventType: EventType, keySelectorCallback: KeySelectorBuilderCallback, callback: ProjectionCallback<T>): this;
    /**
     * Add an on method for handling the event.
     * @param {EventTypeId|Guid|string} eventType The identifier of the event.
     * @param {KeySelectorBuilderCallback<T>} keySelectorCallback Callback for building key selector.
     * @param {ProjectionCallback<T>} callback Callback to call for each event.
     * @returns {ProjectionBuilderForReadModel<T>}
     */
    on(eventTypeId: EventTypeId | Guid | string, keySelectorCallback: KeySelectorBuilderCallback, callback: ProjectionCallback<T>): this;
    /**
     * Add an on method for handling the event.
     * @param {EventTypeId | Guid | string} eventType The identifier of the event.
     * @param {Generation | number} generation The generation of the event type.
     * @param {KeySelectorBuilderCallback<T>} keySelectorCallback Callback for building key selector.
     * @param {ProjectionCallback<T>} method Callback to call for each event.
     * @returns {ProjectionBuilderForReadModel<T>}
     */
    on(eventTypeId: EventTypeId | Guid | string, generation: Generation | number, keySelectorCallback: KeySelectorBuilderCallback, callback: ProjectionCallback<T>): this;
    on<TEvent>(typeOrEventTypeOrId: Constructor<TEvent> | EventType | EventTypeId | Guid | string,
        keySelectorCallbackOrGeneration: KeySelectorBuilderCallback<TEvent> | Generation | number,
        keySelectorCallbackOrCallback?: KeySelectorBuilderCallback<TEvent> | ProjectionCallback<T, TEvent>,
        maybeCallback?: ProjectionCallback<T, TEvent>): this {

        const typeOrEventType = this.getTypeOrEventTypeFrom(typeOrEventTypeOrId, keySelectorCallbackOrGeneration);
        const keySelectorCallback = typeof keySelectorCallbackOrGeneration === 'function'
            ? keySelectorCallbackOrGeneration
            : keySelectorCallbackOrCallback as KeySelectorBuilderCallback<TEvent>;
        const callback = maybeCallback || keySelectorCallbackOrCallback as ProjectionCallback<T>;

        this.onMethods.push([typeOrEventType, keySelectorCallback, callback]);

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

    private tryAddOnMethods(
        eventTypes: IEventTypes,
        events: EventTypeMap<[ProjectionCallback<T>, KeySelector]>): boolean {
        let allMethodsValid = true;
        const keySelectorBuilder = new KeySelectorBuilder();
        for (const [typeOrEventTypeOrId, keySelectorBuilderCallback, method] of this.onMethods) {
            const eventType = this.getEventType(typeOrEventTypeOrId, eventTypes);
            if (events.has(eventType)) {
                allMethodsValid = false;
            }
            events.set(eventType, [method, keySelectorBuilderCallback(keySelectorBuilder)]);
        }
        return allMethodsValid;
    }

    private getTypeOrEventTypeFrom<T>(typeOrEventTypeOrId: Constructor<T> | EventType | EventTypeId | Guid | string,
        keySelectorCallbackOrGeneration: KeySelectorBuilderCallback<T> | Generation | number): Constructor<T> | EventType {

        if (typeof typeOrEventTypeOrId === 'function') {
            return typeOrEventTypeOrId;
        }

        if (typeOrEventTypeOrId instanceof EventType) {
            return typeOrEventTypeOrId;
        }

        const eventTypeId = typeOrEventTypeOrId;
        const eventTypeGeneration = typeof keySelectorCallbackOrGeneration === 'function' ? Generation.first : keySelectorCallbackOrGeneration;

        return new EventType(EventTypeId.from(eventTypeId), Generation.from(eventTypeGeneration));
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
