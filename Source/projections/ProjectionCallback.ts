// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ProjectionContext } from './ProjectionContext';
import { ProjectionResult } from './ProjectionResult';

/**
 * Represents the callback for projection on() method
 */
export type ProjectionCallback<T,U = any> = (readModel: T, event: U, context: ProjectionContext) => T | Promise<T> | ProjectionResult | Promise<ProjectionResult>;
