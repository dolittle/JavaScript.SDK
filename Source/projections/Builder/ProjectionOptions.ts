// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { ScopeId } from '@dolittle/sdk.events';
import { projection } from './projectionDecorator';

/**
 * Defines the options that can be defined in a {@link projection} decorator.
 */
export type ProjectionOptions = { inScope?: ScopeId | Guid | string };
