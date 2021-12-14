// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IPrivateEventFilterBuilder } from './IPrivateEventFilterBuilder';

/**
 * Defines the callback to use for creating private filters.
 */
export type PrivateEventFilterBuilderCallback = (builder: IPrivateEventFilterBuilder) => void;
