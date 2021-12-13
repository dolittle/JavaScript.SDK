// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IEventHandlersBuilder } from './IEventHandlersBuilder';

/**
 * Defines the callback for configuring event handlers.
 */
export type EventHandlersBuilderCallback = (builder: IEventHandlersBuilder) => void;
