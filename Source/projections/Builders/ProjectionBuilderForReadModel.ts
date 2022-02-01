// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

import { IClientBuildResults, IModelBuilder } from '@dolittle/sdk.common';
import { Generation } from '@dolittle/sdk.artifacts';
import { EventType, EventTypeId, EventTypeIdLike, EventTypeMap, IEventTypes, ScopeId } from '@dolittle/sdk.events';

import { IProjection } from '../IProjection';
import { KeySelector } from '../KeySelector';
import { Projection } from '../Projection';
import { ProjectionCallback } from '../ProjectionCallback';
import { ProjectionId } from '../ProjectionId';
import { ProjectionModelId } from '../ProjectionModelId';
import { ProjectionCopies } from '../Copies/ProjectionCopies';
import { MongoDBCopies } from '../Copies/MongoDB/MongoDBCopies';
import { CopyToMongoDBCallback } from './Copies/CopyToMongoDBCallback';
import { CopyToMongoDBBuilder } from './Copies/CopyToMongoDBBuilder';
import { IProjectionBuilderForReadModel } from './IProjectionBuilderForReadModel';
import { KeySelectorBuilder } from './KeySelectorBuilder';
import { KeySelectorBuilderCallback } from './KeySelectorBuilderCallback';
import { OnMethodSpecification } from './OnMethodSpecification';
import { TypeOrEventType } from './TypeOrEventType';
import { ProjectionBuilder } from './ProjectionBuilder';

/**
 * Represents an implementation of {@link IProjectionBuilderForReadModel}.
 * @template T The type of the projection read model.
 */
export class ProjectionBuilderForReadModel<T> extends IProjectionBuilderForReadModel<T> {
    private _onMethods: OnMethodSpecification<T>[] = [];
    private _copyToMongoDBCallback?: CopyToMongoDBCallback<T>;

    /**
     * Initializes a new instance of {@link ProjectionBuilder}.
     * @param {ProjectionId} _projectionId - The unique identifier of the projection to build for.
     * @param {Constructor<T> | T} _readModelTypeOrInstance - The type or instance of the read model to build a projection for.
     * @param {ScopeId} _scopeId - The scope of the projection.
     * @param {IModelBuilder} _modelBuilder - For binding the parent projection builder and read model to its identifier.
     * @param {ProjectionBuilder} _parentBuilder - For binding the builder to the identifier.
     */
    constructor(
        private readonly _projectionId: ProjectionId,
        private readonly _readModelTypeOrInstance: Constructor<T> | T,
        private _scopeId: ScopeId,
        private readonly _modelBuilder: IModelBuilder,
        private readonly _parentBuilder: ProjectionBuilder,
    ) {
        super();
        this._modelBuilder.bindIdentifierToProcessorBuilder(this._modelId, this._parentBuilder);
        if (_readModelTypeOrInstance instanceof Function) {
            this._modelBuilder.bindIdentifierToType(this._modelId, _readModelTypeOrInstance);
        }
    }

    /** @inheritdoc */
    on<TEvent>(type: Constructor<TEvent>, keySelectorCallback: KeySelectorBuilderCallback<TEvent>, callback: ProjectionCallback<T, TEvent>): IProjectionBuilderForReadModel<T>;
    on(eventType: EventType, keySelectorCallback: KeySelectorBuilderCallback<any>, callback: ProjectionCallback<T, any>): IProjectionBuilderForReadModel<T>;
    on(eventTypeId: EventTypeIdLike, keySelectorCallback: KeySelectorBuilderCallback<any>, callback: ProjectionCallback<T, any>): IProjectionBuilderForReadModel<T>;
    on(eventTypeId: EventTypeIdLike, generation: number | Generation, keySelectorCallback: KeySelectorBuilderCallback<any>, callback: ProjectionCallback<T, any>): IProjectionBuilderForReadModel<T>;
    on<TEvent>(
        typeOrEventTypeOrId: Constructor<TEvent> | EventType | EventTypeIdLike,
        keySelectorCallbackOrGeneration: KeySelectorBuilderCallback<TEvent> | Generation | number,
        keySelectorCallbackOrCallback?: KeySelectorBuilderCallback<TEvent> | ProjectionCallback<T, TEvent>,
        maybeCallback?: ProjectionCallback<T, TEvent>
    ): IProjectionBuilderForReadModel<T> {

        const typeOrEventType = this.getTypeOrEventTypeFrom(typeOrEventTypeOrId, keySelectorCallbackOrGeneration);
        const keySelectorCallback = typeof keySelectorCallbackOrGeneration === 'function'
            ? keySelectorCallbackOrGeneration
            : keySelectorCallbackOrCallback as KeySelectorBuilderCallback<TEvent>;
        const callback = maybeCallback || keySelectorCallbackOrCallback as ProjectionCallback<T>;

        this._onMethods.push([typeOrEventType, keySelectorCallback, callback]);

        return this;
    }

    /** @inheritdoc */
    inScope(scopeId: string | Guid | ScopeId): IProjectionBuilderForReadModel<T> {
        this._modelBuilder.unbindIdentifierFromProcessorBuilder(this._modelId, this._parentBuilder);
        this._scopeId = ScopeId.from(scopeId);
        this._modelBuilder.bindIdentifierToProcessorBuilder(this._modelId, this._parentBuilder);
        return this;
    }

    /** @inheritdoc */
    copyToMongoDB(callback?: CopyToMongoDBCallback<T>): IProjectionBuilderForReadModel<T> {
        this._copyToMongoDBCallback = callback ?? (() => {});
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
        if (this._onMethods.length < 1) {
            results.addFailure(`Failed to register projection ${this._projectionId}. No on methods are configured`);
            return;
        }
        const allMethodsBuilt = this.tryAddOnMethods(eventTypes, events);
        if (!allMethodsBuilt) {
            results.addFailure(`Failed to register projection ${this._projectionId}. Could not build projection`, 'Maybe it tries to handle the same type of event twice?');
            return;
        }

        const copies = this.buildCopies(results);
        if (copies === undefined) {
            results.addFailure(`Failed to register projection ${this._projectionId}. Copies specification is not valid`);
            return undefined;
        }

        return new Projection<T>(this._projectionId, this._readModelTypeOrInstance, this._scopeId, events, copies);
    }

    private tryAddOnMethods(
        eventTypes: IEventTypes,
        events: EventTypeMap<[ProjectionCallback<T>, KeySelector]>): boolean {
        let allMethodsValid = true;
        const keySelectorBuilder = new KeySelectorBuilder();
        for (const [typeOrEventTypeOrId, keySelectorBuilderCallback, method] of this._onMethods) {
            const eventType = this.getEventType(typeOrEventTypeOrId, eventTypes);
            if (events.has(eventType)) {
                allMethodsValid = false;
            }
            events.set(eventType, [method, keySelectorBuilderCallback(keySelectorBuilder)]);
        }
        return allMethodsValid;
    }

    private getTypeOrEventTypeFrom<T>(typeOrEventTypeOrId: Constructor<T> | EventType | EventTypeIdLike,
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

    private buildCopies(results: IClientBuildResults): ProjectionCopies | undefined {
        const mongoDBCopies = this.buildMongoDBCopies(results);

        if (mongoDBCopies === undefined) {
            return undefined;
        }

        return new ProjectionCopies(
            mongoDBCopies,
        );
    }

    private buildMongoDBCopies(results: IClientBuildResults): MongoDBCopies | undefined {
        if (this._copyToMongoDBCallback === undefined) {
            return MongoDBCopies.default;
        }

        const builder = new CopyToMongoDBBuilder(this._projectionId, this._readModelTypeOrInstance);
        this._copyToMongoDBCallback(builder);
        return builder.build(results);
    }

    private get _modelId(): ProjectionModelId {
        return new ProjectionModelId(this._projectionId, this._scopeId);
    }
}
