// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ProjectionContext } from '../';

/**
 * Represents the callback for projection on() method
 */
export type ProjectionClassOnMethod<T = any> = (event: T, context: ProjectionContext) => void | Promise<void>;
