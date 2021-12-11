// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';

import { ScopeId } from '@dolittle/sdk.events';

import { EventHandlerAliasLike } from '../EventHandlerAlias';

/**
 * Defines the options that can be defined in a {@link eventHandler} decorator.
 */
export type EventHandlerOptions = { inScope?: ScopeId | Guid | string, partitioned?: boolean, alias?: EventHandlerAliasLike };
