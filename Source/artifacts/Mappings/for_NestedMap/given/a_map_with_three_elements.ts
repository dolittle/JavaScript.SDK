// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { NestedMap } from '../../NestedMap';
import { map } from './types';
import { firstKey, firstValue, secondKey, secondValue, thirdKey, thirdValue } from './values';

export * from './types';
export * from './values';

export const a_map_with_three_elements = (): map => {
    const map = new NestedMap(3);
    map.set(firstKey, firstValue);
    map.set(secondKey, secondValue);
    map.set(thirdKey, thirdValue);
    return map as map;
};
