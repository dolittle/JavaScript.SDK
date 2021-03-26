// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { Guid } from '@dolittle/rudiments';
import { EventType, EventTypeId, EventTypeMap, Generation, IEventTypes } from '@dolittle/sdk.artifacts';
import { IContainer } from '@dolittle/sdk.common';
import { ScopeId } from '@dolittle/sdk.events';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { Cancellation } from '@dolittle/sdk.resilience';
import { Constructor } from '@dolittle/types';

import { ProjectionsClient } from '@dolittle/runtime.contracts/Runtime/Events.Processing/Projections_grpc_pb';

import { IProjections, KeySelector, Projection, ProjectionCallback, ProjectionId } from '../';
import { ProjectionProcessor } from '../Internal';

import { ICanBuildAndRegisterAProjection } from './ICanBuildAndRegisterAProjection';
import { InitialStateCallback } from './InitialStateCallback';
import { KeySelectorBuilder } from './KeySelectorBuilder';
import { KeySelectorBuilderCallback } from './KeySelectorBuilderCallback';

type TypeOrEventType = Constructor<any> | EventType;
type OnMethodSpecification = [TypeOrEventType, KeySelectorBuilderCallback, ProjectionCallback<any>];

/**
 * Represents a builder for building {@link IProjection}.
 */
export class ProjectionBuilderForReadModel<T> implements ICanBuildAndRegisterAProjection {
    private _initialState?: T;
    private _onMethods: OnMethodSpecification[] = [];

    /**
     * Initializes a new instance of {@link ProjectionBuilder}.
     * @param {ProjectionId} _projectionId  The unique identifier of the projection to build for
     */
    constructor(
        private _projectionId: ProjectionId,
        private _readModelTypeOrInstance: Constructor<T> | T,
        private _scopeId: ScopeId) { }

    /**
     * Defines the projection to operate on a specific {@link ScopeId}.
     * @param {ScopeId | Guid | string} scopeId Scope the projection operates on.
     * @returns {ProjectionBuilderForReadModel<T>}
     */
    inScope(scopeId: ScopeId | Guid | string): ProjectionBuilderForReadModel<T> {
        this._scopeId = ScopeId.from(scopeId);
        return this;
    }

    /**
     * Add an on method for handling the event.
     * @template U Type of event.
     * @param {Constructor<U>} type The type of event.
     * @param {KeySelectorBuilderCallback<U>} keySelectorCallback Callback for building key selector.
     * @param {ProjectionCallback<T,U>} callback Callback to call for each event.
     * @returns {ProjectionBuilderForReadModel<T>}
     */
    on<U>(type: Constructor<U>, keySelectorCallback: KeySelectorBuilderCallback<U>, callback: ProjectionCallback<T, U>): ProjectionBuilderForReadModel<T>;
    /**
     * Add an on method for handling the event.
     * @param {EventType} eventType The identifier of the event.
     * @param {KeySelectorBuilderCallback<U>} keySelectorCallback Callback for building key selector.
     * @param {ProjectionCallback<T>} callback Callback to call for each event.
     * @returns {ProjectionBuilderForReadModel<T>}
     */
    on(eventType: EventType, keySelectorCallback: KeySelectorBuilderCallback, callback: ProjectionCallback<T>): ProjectionBuilderForReadModel<T>;
    /**
     * Add an on method for handling the event.
     * @param {EventTypeId|Guid|string} eventType The identifier of the event.
     * @param {KeySelectorBuilderCallback<U>} keySelectorCallback Callback for building key selector.
     * @param {ProjectionCallback<T>} callback Callback to call for each event.
     * @returns {ProjectionBuilderForReadModel<T>}
     */
    on(eventTypeId: EventTypeId | Guid | string, keySelectorCallback: KeySelectorBuilderCallback, callback: ProjectionCallback<T>): ProjectionBuilderForReadModel<T>;
    /**
     * Add an on method for handling the event.
     * @param {EventTypeId | Guid | string} eventType The identifier of the event.
     * @param {Generation | number} generation The generation of the event type.
     * @param {KeySelectorBuilderCallback<U>} keySelectorCallback Callback for building key selector.
     * @param {ProjectionCallback<T>} method Callback to call for each event.
     * @returns {ProjectionBuilderForReadModel<T>}
     */
    on(eventTypeId: EventTypeId | Guid | string, generation: Generation | number, keySelectorCallback: KeySelectorBuilderCallback, callback: ProjectionCallback<T>): ProjectionBuilderForReadModel<T>;
    on<U>(typeOrEventTypeOrId: Constructor<T> | EventType | EventTypeId | Guid | string,
        keySelectorCallbackOrGeneration: KeySelectorBuilderCallback<U> | Generation | number,
        keySelectorCallbackOrCallback?: KeySelectorBuilderCallback<U> | ProjectionCallback<T>,
        maybeCallback?: ProjectionCallback<T, U>): ProjectionBuilderForReadModel<T> {

        const typeOrEventType = this.getTypeEventTypeFrom(typeOrEventTypeOrId, keySelectorCallbackOrGeneration);
        const keySelectorCallback = typeof keySelectorCallbackOrGeneration === 'function'
            ? keySelectorCallbackOrGeneration
            : keySelectorCallbackOrCallback as KeySelectorBuilderCallback<U>;
        const callback = maybeCallback || keySelectorCallbackOrCallback as ProjectionCallback<T, U>;

        this._onMethods.push([typeOrEventType, keySelectorCallback, callback]);

        return this;
    }

    private getTypeEventTypeFrom<U>(typeOrEventTypeOrId: Constructor<T> | EventType | EventTypeId | Guid | string,
        keySelectorCallbackOrGeneration: KeySelectorBuilderCallback<U> | Generation | number): Constructor<T> | EventType {

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

    /** @inheritdoc */
    buildAndRegister(
        client: ProjectionsClient,
        projections: IProjections,
        container: IContainer,
        executionContext: ExecutionContext,
        eventTypes: IEventTypes,
        logger: Logger,
        cancellation: Cancellation): void {

        const events = new EventTypeMap<[ProjectionCallback<any>, KeySelector]>();
        if (this._onMethods.length < 1) {
            logger.warn(`Failed to register projection ${this._projectionId}. No on methods are configured`);
            return;
        }
        const allMethodsBuilt = this.tryAddProjectionMethods(eventTypes, events, logger);
        if (!allMethodsBuilt) {
            logger.warn(`Failed to register projection ${this._projectionId}. Could not build projection.`);
            return;
        }
        const projection = new Projection<T>(this._projectionId, this._readModelTypeOrInstance, this._scopeId, events);
        projections.register(
            new ProjectionProcessor(
                projection,
                client,
                executionContext,
                eventTypes,
                logger
            ), cancellation);
    }

    private tryAddProjectionMethods(
        eventTypes: IEventTypes,
        events: EventTypeMap<[ProjectionCallback<any>, KeySelector]>,
        logger: Logger): boolean {
        let allMethodsValid = true;
        const keySelectorBuilder = new KeySelectorBuilder();
        for (const [typeOrEventTypeOrId, keySelectorBuilderCallback, method] of this._onMethods) {
            const eventType = this.getEventType(typeOrEventTypeOrId, eventTypes);
            if (events.has(eventType)) {
                allMethodsValid = false;
                logger.warn(`Projection ${this._projectionId} already handles event with event type ${eventType}`);
            }
            events.set(eventType, [method, keySelectorBuilderCallback(keySelectorBuilder)]);
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
