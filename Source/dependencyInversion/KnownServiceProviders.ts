// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { InversifyContainer } from './Types/InversifyContainer';
import { TSyringeContainer } from './Types/TSyringeContainer';

/**
 * Defines the service provider types the Dolittle SDK is compatible with.
 */
export type KnownServiceProviders =
    InversifyContainer |
    TSyringeContainer;
