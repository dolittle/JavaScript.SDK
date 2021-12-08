// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IEventFiltersBuilder } from './IEventFiltersBuilder';

/**
 * Defines the callback to use for creating unpartitioned filters.
 */
export type EventFiltersBuilderCallback = (builder: IEventFiltersBuilder) => void;
