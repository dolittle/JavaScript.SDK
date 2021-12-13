// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { PublicEventFilterBuilder } from './PublicEventFilterBuilder';

/**
 * Defines the callback to use for creating public filters.
 */
export type PublicEventFilterBuilderCallback = (builder: PublicEventFilterBuilder) => void;
