// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { EventType, EventTypeId, EventTypeMap, Generation, IEventTypes } from '@dolittle/sdk.events';
import { Constructor } from '@dolittle/types';
import { KeySelector, KeySelectorBuilder } from '..';
import { KeySelectorBuilderCallback } from './KeySelectorBuilderCallback';
import { OnMethodSpecification } from './OnMethodSpecification';
import { TypeOrEventType } from './TypeOrEventType';

/**
 * Represents a builder for building and getting the inline on() methods for inline projections.
 */
export abstract class OnMethodBuilder<T, TCallback> {
}
