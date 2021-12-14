// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

/**
 * Defines a callback to be invoked with a {@link Constructor}.
 */
export type ClassCallback = (type: Constructor<any>) => void;
