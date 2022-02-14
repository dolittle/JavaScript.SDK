// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';

import { ScopeId } from '@dolittle/sdk.events';

import { EventHandlerAliasLike } from '../EventHandlerAlias';
import { IEventHandlerMethodsBuilder } from './IEventHandlerMethodsBuilder';

/**
 * Defines a builder for building event handlers from callbacks.
 */
export abstract class IEventHandlerBuilder {
    /**
     * Defines the event handler to be partitioned - this is default for a event handler.
     * @returns {IEventHandlerMethodsBuilder} The builder to use for adding method callbacks.
     */
    abstract partitioned(): IEventHandlerMethodsBuilder;

    /**
     * Defines the event handler to be unpartitioned. By default it will be partitioned.
     * @returns {IEventHandlerMethodsBuilder} The builder to use for adding method callbacks.
     */
    abstract unpartitioned(): IEventHandlerMethodsBuilder;

    /**
     * Defines the event handler to operate on a specific {@link ScopeId}.
     * @param {ScopeId | Guid | string} scopeId - Scope the event handler operates on.
     * @returns {IEventHandlerBuilder} The builder for continuation.
     */
    abstract inScope(scopeId: ScopeId | Guid | string): IEventHandlerBuilder;

    /**
     * Defines an alias for the event handler.
     * @param {EventHandlerAliasLike} alias - The event handler alias.
     * @returns {IEventHandlerBuilder} The builder for continuation.
     */
    abstract withAlias(alias: EventHandlerAliasLike): IEventHandlerBuilder;
}
