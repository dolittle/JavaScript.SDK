// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IEventStore, IEventStoreBuilder } from '@dolittle/sdk.events';

export type EventStoreBuilderCallback = (builder: IEventStoreBuilder) => IEventStore;
