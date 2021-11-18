// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { EventPropertyKeySelector } from './EventPropertyKeySelector';
import { EventSourceIdKeySelector } from './EventSourceIdKeySelector';
import { PartitionIdKeySelector } from './PartitionIdKeySelector';

/**
 * Represents a key selector.
 */
 export type KeySelector = EventPropertyKeySelector | EventSourceIdKeySelector | PartitionIdKeySelector;
