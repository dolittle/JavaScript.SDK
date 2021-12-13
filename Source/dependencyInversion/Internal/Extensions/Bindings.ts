// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { interfaces } from 'inversify';

/**
 * Defines a system to register service bindings.
 */
export type Bindings = Pick<interfaces.Container, 'bind'>;
