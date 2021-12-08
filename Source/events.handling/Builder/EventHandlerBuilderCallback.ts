// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { EventHandlerBuilder } from './EventHandlerBuilder';

/**
 * Defines the callback for building instances of {@link IEventHandler}.
 */
export type EventHandlerBuilderCallback = (builder: EventHandlerBuilder) => void;
