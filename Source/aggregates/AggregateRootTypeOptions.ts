// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { AggregateRootTypeAliasLike } from './AggregateRootTypeAlias';
import { aggregateRoot } from './aggregateRootDecorator';

/**
 * Defines the options that can be defined in a {@link aggregateRoot} decorator.
 */
export type AggregateRootTypeOptions = { alias?: AggregateRootTypeAliasLike };
