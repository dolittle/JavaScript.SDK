// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { GenerationLike } from '@dolittle/sdk.artifacts';
import { EventTypeAliasLike } from './EventTypeAlias';
import { eventType } from './eventTypeDecorator';

/**
 * Defines the options that can be defined in a {@link eventType} decorator.
 */
export type EventTypeOptions = { generation?: GenerationLike, alias?: EventTypeAliasLike };
