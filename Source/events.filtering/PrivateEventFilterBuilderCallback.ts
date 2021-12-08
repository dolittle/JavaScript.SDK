// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { PrivateEventFilterBuilder } from './PrivateEventFilterBuilder';

/**
 * Defines the callback to use for creating partitioned filters.
 */
export type PrivateEventFilterBuilderCallback = (builder: PrivateEventFilterBuilder) => void;
