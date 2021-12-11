// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { AggregateRootsBuilder } from './AggregateRootsBuilder';

/**
 * Defines the callback for registering aggregate roots.
 */
export type AggregateRootsBuilderCallback = (builder: AggregateRootsBuilder) => void;
