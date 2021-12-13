// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ProjectionCallback } from '../ProjectionCallback';
import { KeySelectorBuilderCallback } from './KeySelectorBuilderCallback';
import { TypeOrEventType } from './TypeOrEventType';

/**
 * Defines the specification of a projection on method.
 */
export type OnMethodSpecification<T> = [TypeOrEventType, KeySelectorBuilderCallback, ProjectionCallback<T>];
