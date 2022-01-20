// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IEventTypesBuilder } from './IEventTypesBuilder';

/**
 * Defines the callback for registering event types.
 */
export type EventTypesBuilderCallback = (builder: IEventTypesBuilder) => void;
