// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ISubscriptionsBuilder } from './ISubscriptionsBuilder';

/**
 * Defines the callback for building event horizon subscriptions.
 */
export type SubscriptionsBuilderCallback = (builder: ISubscriptionsBuilder) => void;
