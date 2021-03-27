// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { IEventTypes } from '@dolittle/sdk.artifacts';
import { IContainer } from '@dolittle/sdk.common';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { Cancellation } from '@dolittle/sdk.resilience';
import { ProjectionsClient } from '@dolittle/runtime.contracts/Runtime/Events.Processing/Projections_grpc_pb';

import { IProjections } from '../IProjections';

export interface ICanBuildAndRegisterAProjection {

    /**
     * Builds and registers a projection
     * @param {ProjectionsClient} client The projections client.
     * @param {IProjections} projections  The projections.
     * @param {IContainer} container The IoC container.
     * @param {ExcecutionContext} executionContext The execution context.
     * @param {IEventTypes} eventTypes The event types.
     * @param {Logger} logger The logger.
     * @param {Cancellation} cancellation The cancellation token.
     */
    buildAndRegister(
        client: ProjectionsClient,
        projections: IProjections,
        container: IContainer,
        executionContext: ExecutionContext,
        eventTypes: IEventTypes,
        logger: Logger,
        cancellation: Cancellation): void
}