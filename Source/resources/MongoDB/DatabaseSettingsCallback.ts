// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { DbOptions } from 'mongodb';

/**
 * Represents the callback for configuring {@link DbOptions}.
 */
export type DatabaseSettingsCallback = (settings: DbOptions) => void;
