// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { NestedMap } from '../../NestedMap';
import { map } from './types';

export * from './types';
export * from './values';

export const an_empty_map = (): map => new NestedMap(3);
