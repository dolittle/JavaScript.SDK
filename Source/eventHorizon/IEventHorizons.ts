// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { TenantId } from '@dolittle/sdk.execution';
import { Subscription } from './Subscription';

/**
 * Defines the capabilities of the event horizons.
 */
export interface IEventHorizons {
    readonly subscriptions: Map<TenantId, Subscription[]>;
}

