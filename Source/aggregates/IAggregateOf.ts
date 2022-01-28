// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

import { Abstract, ServiceIdentifier } from '@dolittle/sdk.dependencyinversion';
import { EventSourceIdLike } from '@dolittle/sdk.events';

import { AggregateRoot } from './AggregateRoot';
import { IAggregateRootOperations } from './IAggregateRootOperations';

/**
 * Defines a way to work with an {@link AggregateRoot}.
 * @template TAggregate
 */
export abstract class IAggregateOf<TAggregate extends AggregateRoot> {
    /**
     * Create a new {@link AggregateRoot} with a random {@link EventSourceId}.
     * @returns {IAggregateRootOperations<TAggregate>}
     */
    abstract create(): IAggregateRootOperations<TAggregate>;

    /**
     * Gets an {@link AggregateRoot} with a given {@link EventSourceId}.
     * @param {EventSourceIdLike} eventSourceId - {@link EventSourceId} Of the {@link AggregateRoot}.
     * @returns {IAggregateRootOperations<TAggregate>}
     */
    abstract get(eventSourceId: EventSourceIdLike): IAggregateRootOperations<TAggregate>;

    /**
     * Gets a {@link ServiceIdentifier} for an {@link AggregateRoot} type to inject an {@link IAggragateOf} from the service provider.
     * @param {Constructor} type - The type of the aggregate root.
     * @returns {Abstract} The service identifier to use for injection.
     */
    static for<TAggregate extends AggregateRoot>(type: Constructor<TAggregate>): Abstract<IAggregateOf<TAggregate>> {
        return `IAggregateOf<${type.name}>` as any;
    }
}
