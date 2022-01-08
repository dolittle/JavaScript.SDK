// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { NestedMap } from '../../NestedMap';
import { map } from './types';
import { firstKey, firstValue } from './values';

export * from './types';
export * from './values';

export const a_map_with_one_element = (): map => {
    const map = new NestedMap(3);
    map.set(firstKey, firstValue);
    return map as map;
};
