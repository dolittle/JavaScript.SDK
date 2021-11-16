// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';
import { EventType } from '@dolittle/sdk.events';

/**
 * Represents an event type as either a class or an {@link EventType}.
 */
export type TypeOrEventType = Constructor<any> | EventType;
