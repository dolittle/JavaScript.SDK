// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger} from 'winston';

import { IEventTypes } from '@dolittle/sdk.artifacts';
import { EventStoreBuilder } from '@dolittle/sdk.events';
import { IFilters } from '@dolittle/sdk.events.filtering';
import { IEventHandlers } from '@dolittle/sdk.events.handling';
import { MicroserviceId } from '@dolittle/sdk.execution';
import { IEventHorizons } from '@dolittle/sdk.eventhorizon';

import { ClientBuilder } from './ClientBuilder';


/**
 * Represents the client for working with the Dolittle Runtime
 */
export class Client {

    /**
     * Creates an instance of client.
     * @param {Logger} logger Winston Logger for logging.
     * @param {IArtifacts} artifacts All the configured artifacts.
     * @param {EventStoreBuilder} eventStore The event store builder to work with.
     * @param {IEventHandlers} eventHandlers All the event handlers.
     * @param {IFilters} filters All the filters.
     * @param {IEventHorizons} eventHorizons All event horizons.
     */
    constructor(
        readonly logger: Logger,
        readonly eventTypes: IEventTypes,
        readonly eventStore: EventStoreBuilder,
        readonly eventHandlers: IEventHandlers,
        readonly filters: IFilters,
        readonly eventHorizons: IEventHorizons) {
    }

    /**
     * Create a client builder for a Microservice
     * @param {MicroserviceId | string} microserviceId The unique identifier for the microservice.
     * @returns {ClientBuilder} The builder to build a {Client} from.
     */
    static forMicroservice(microserviceId: MicroserviceId | string) {
        return new ClientBuilder(MicroserviceId.from(microserviceId));
    }
}
