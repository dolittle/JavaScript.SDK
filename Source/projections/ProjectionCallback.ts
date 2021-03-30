// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { DeleteReadModelInstance } from './DeleteReadModelInstance';
import { ProjectionContext } from './ProjectionContext';

/**
 * Represents the callback for a projection on() method
 */
export type ProjectionCallback<T,U = any> = (readModel: T, event: U, context: ProjectionContext) => T | DeleteReadModelInstance | Promise<T | DeleteReadModelInstance>;
