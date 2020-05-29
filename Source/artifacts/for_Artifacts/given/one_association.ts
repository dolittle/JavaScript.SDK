// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Artifacts } from '../../Artifacts';
import { Artifact } from '../../Artifact';
import { Guid } from '@dolittle/rudiments';

class MyType {}

const artifact = {id: Guid.create(), generation: 1};
const map = new Map<Function, Artifact>();
map.set(MyType, artifact);
const artifacts = new Artifacts(map);

export default {
    artifacts: artifacts,
    type: MyType
};
