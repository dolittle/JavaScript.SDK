// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid, IEquatable } from '@dolittle/rudiments';

import { IClientBuildResults, IModelBuilder } from '@dolittle/sdk.common';
import { IServiceProviderBuilder } from '@dolittle/sdk.dependencyinversion';
import { EventTypeMap, IEventTypes, ScopeId } from '@dolittle/sdk.events';

import { EventHandler } from '../EventHandler';
import { EventHandlerAlias, EventHandlerAliasLike } from '../EventHandlerAlias';
import { EventHandlerId } from '../EventHandlerId';
import { EventHandlerModelId } from '../EventHandlerModelId';
import { EventHandlerSignature } from '../EventHandlerSignature';
import { IEventHandler } from '../IEventHandler';
import { EventHandlerMethodsBuilder } from './EventHandlerMethodsBuilder';
import { IEventHandlerBuilder } from './IEventHandlerBuilder';
import { IEventHandlerMethodsBuilder } from './IEventHandlerMethodsBuilder';

/**
 * Represents an implementation of {@link IEventHandlerBuilder}.
 */
export class EventHandlerBuilder extends IEventHandlerBuilder implements IEquatable {
    private _methodsBuilder?: EventHandlerMethodsBuilder;
    private _scopeId: ScopeId = ScopeId.default;
    private _alias?: EventHandlerAlias;
    private _partitioned!: boolean;

    /**
     * Initializes a new instance of {@link EventHandlerBuilder}.
     * @param {EventHandlerId} _eventHandlerId - The unique identifier of the event handler to build for.
     * @param {IModelBuilder} _modelBuilder - For binding the event handler to its identifier.
     */
    constructor(private readonly _eventHandlerId: EventHandlerId, private readonly _modelBuilder: IModelBuilder) {
        super();
        this._modelBuilder.bindIdentifierToProcessorBuilder(this._modelId, this);
    }

    /** @inheritdoc */
    partitioned(): IEventHandlerMethodsBuilder {
        this._partitioned = true;
        this._methodsBuilder = new EventHandlerMethodsBuilder(this._eventHandlerId);
        return this._methodsBuilder;
    }

    /** @inheritdoc */
    unpartitioned(): IEventHandlerMethodsBuilder {
        this._partitioned = false;
        this._methodsBuilder = new EventHandlerMethodsBuilder(this._eventHandlerId);
        return this._methodsBuilder;
    }

    /** @inheritdoc */
    inScope(scopeId: string | ScopeId | Guid): IEventHandlerBuilder {
        this._modelBuilder.unbindIdentifierFromProcessorBuilder(this._modelId, this);
        this._scopeId = ScopeId.from(scopeId);
        this._modelBuilder.bindIdentifierToProcessorBuilder(this._modelId, this);
        return this;
    }

    /** @inheritdoc */
    withAlias(alias: EventHandlerAliasLike): IEventHandlerBuilder {
        this._alias = EventHandlerAlias.from(alias);
        return this;
    }

    /** @inheritdoc */
    equals(other: any): boolean {
        return this === other;
    }

    /**
     * Builds the event handler.
     * @param {IEventTypes} eventTypes - For event types resolution.
     * @param {IServiceProviderBuilder} bindings - For registering the bindings for the event handler class.
     * @param {IClientBuildResults} results - For keeping track of build results.
     * @returns {IEventHandler | undefined} The built event handler if successful.
     */
    build(eventTypes: IEventTypes, bindings: IServiceProviderBuilder, results: IClientBuildResults): IEventHandler | undefined {
        const eventTypeToMethods = new EventTypeMap<EventHandlerSignature<any>>();
        if (this._methodsBuilder === undefined) {
            results.addFailure(`Failed to build event handler ${this._eventHandlerId}. No event handler methods are configured for event handler`);
            return;
        }
        const allMethodsBuilt = this._methodsBuilder.tryAddEventHandlerMethods(eventTypes, eventTypeToMethods, results);
        if (!allMethodsBuilt) {
            results.addFailure(`Could not build event handler ${this._eventHandlerId}`);
            return;
        }
        return new EventHandler(this._eventHandlerId, this._scopeId, this._partitioned, eventTypeToMethods, this._alias);
    }

    private get _modelId(): EventHandlerModelId {
        return new EventHandlerModelId(this._eventHandlerId, this._scopeId);
    }
}
