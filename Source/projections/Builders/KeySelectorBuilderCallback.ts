// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { KeySelector } from '../KeySelector';
import { KeySelectorBuilder } from './KeySelectorBuilder';

/**
 * Represents the signature for a projection's key selector expression.
 */
export type KeySelectorBuilderCallback<T = any> = (builder: KeySelectorBuilder<T>) => KeySelector;
