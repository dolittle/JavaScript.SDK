// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { EventOccurredKeySelector } from './EventOccurredKeySelector';
import { EventPropertyKeySelector } from './EventPropertyKeySelector';
import { EventSourceIdKeySelector } from './EventSourceIdKeySelector';
import { PartitionIdKeySelector } from './PartitionIdKeySelector';
import { StaticKeySelector } from './StaticKeySelector';

/**
 * Represents a key selector.
 */
 export type KeySelector = EventPropertyKeySelector | EventSourceIdKeySelector | PartitionIdKeySelector | StaticKeySelector | EventOccurredKeySelector;
