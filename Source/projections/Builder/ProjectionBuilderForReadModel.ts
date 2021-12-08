// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

import { IClientBuildResults } from '@dolittle/sdk.common/ClientSetup';
import { Generation } from '@dolittle/sdk.artifacts';
import { EventType, EventTypeId, EventTypeMap, IEventTypes, ScopeId } from '@dolittle/sdk.events';

import { IProjection, KeySelector, Projection, ProjectionCallback, ProjectionId } from '../';
import { IProjectionBuilderForReadModel } from './IProjectionBuilderForReadModel';
import { KeySelectorBuilder } from './KeySelectorBuilder';
import { KeySelectorBuilderCallback } from './KeySelectorBuilderCallback';
import { OnMethodSpecification } from './OnMethodSpecification';
import { TypeOrEventType } from './TypeOrEventType';

/**
 * Represents an implementation of {@link IProjectionBuilderForReadModel}.
 * @template T The type of the projection read model.
 */
export class ProjectionBuilderForReadModel<T> extends IProjectionBuilderForReadModel<T> {
    private onMethods: OnMethodSpecification<T>[] = [];

    /**
     * Initializes a new instance of {@link ProjectionBuilder}.
     * @param {ProjectionId} _projectionId - The unique identifier of the projection to build for.
     * @param {Constructor<T> | T} _readModelTypeOrInstance - The type or instance of the read model to build a projection for.
     * @param {ScopeId} _scopeId - The scope of the projection.
     */
    constructor(
        private _projectionId: ProjectionId,
        private _readModelTypeOrInstance: Constructor<T> | T,
        private _scopeId: ScopeId
    ) {
        super();
    }

    /** @inheritdoc */
    on<TEvent>(type: Constructor<TEvent>, keySelectorCallback: KeySelectorBuilderCallback<TEvent>, callback: ProjectionCallback<T, TEvent>): IProjectionBuilderForReadModel<T>;
    on(eventType: EventType, keySelectorCallback: KeySelectorBuilderCallback<any>, callback: ProjectionCallback<T, any>): IProjectionBuilderForReadModel<T>;
    on(eventTypeId: string | Guid | EventTypeId, keySelectorCallback: KeySelectorBuilderCallback<any>, callback: ProjectionCallback<T, any>): IProjectionBuilderForReadModel<T>;
    on(eventTypeId: string | Guid | EventTypeId, generation: number | Generation, keySelectorCallback: KeySelectorBuilderCallback<any>, callback: ProjectionCallback<T, any>): IProjectionBuilderForReadModel<T>;
    on<TEvent>(
        typeOrEventTypeOrId: Constructor<TEvent> | EventType | EventTypeId | Guid | string,
        keySelectorCallbackOrGeneration: KeySelectorBuilderCallback<TEvent> | Generation | number,
        keySelectorCallbackOrCallback?: KeySelectorBuilderCallback<TEvent> | ProjectionCallback<T, TEvent>,
        maybeCallback?: ProjectionCallback<T, TEvent>
    ): IProjectionBuilderForReadModel<T> {

        const typeOrEventType = this.getTypeOrEventTypeFrom(typeOrEventTypeOrId, keySelectorCallbackOrGeneration);
        const keySelectorCallback = typeof keySelectorCallbackOrGeneration === 'function'
            ? keySelectorCallbackOrGeneration
            : keySelectorCallbackOrCallback as KeySelectorBuilderCallback<TEvent>;
        const callback = maybeCallback || keySelectorCallbackOrCallback as ProjectionCallback<T>;

        this.onMethods.push([typeOrEventType, keySelectorCallback, callback]);

        return this;
    }

    /** @inheritdoc */
    inScope(scopeId: string | Guid | ScopeId): IProjectionBuilderForReadModel<T> {
        this._scopeId = ScopeId.from(scopeId);
        return this;
    }

    /**
     * Builds the projection.
     * @param {IEventTypes} eventTypes - For event types resolution.
     * @param {IClientBuildResults} results - For keeping track of build results.
     * @returns {IProjection | undefined} The built projection if successful.
     */
    build(eventTypes: IEventTypes, results: IClientBuildResults): IProjection<T> | undefined {

        const events = new EventTypeMap<[ProjectionCallback<T>, KeySelector]>();
        if (this.onMethods.length < 1) {
            results.addFailure(`Failed to register projection ${this._projectionId}. No on methods are configured`);
            return;
        }
        const allMethodsBuilt = this.tryAddOnMethods(eventTypes, events);
        if (!allMethodsBuilt) {
            results.addFailure(`Failed to register projection ${this._projectionId}. Could not build projection`, 'Maybe it tries to handle the same type of event twice?');
            return;
        }
        return new Projection<T>(this._projectionId, this._readModelTypeOrInstance, this._scopeId, events);
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
