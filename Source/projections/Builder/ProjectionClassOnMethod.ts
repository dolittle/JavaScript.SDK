// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ProjectionContext, DeleteReadModelInstance } from '../';

/**
 * Defines the signature of a projection class's on() method
 */
export type ProjectionClassOnMethod<T = any> = (event: T, context: ProjectionContext) => void | DeleteReadModelInstance | Promise<void | DeleteReadModelInstance>;
