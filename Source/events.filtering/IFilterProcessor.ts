// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Internal } from '@dolittle/sdk.events.processing';

import { FiltersClient } from '@dolittle/runtime.contracts/Events.Processing/Filters_grpc_pb';

/**
 * Defines a {@link Internal.IEventProcessor} that filters events to a stream.
 */
export type IFilterProcessor = Internal.IEventProcessor<FiltersClient>;
