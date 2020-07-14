// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid, Constructor } from '@dolittle/rudiments';
import { Artifacts } from '../../Artifacts';
import { Artifact } from '../../Artifact';

class MyType {}

const artifact = { id: Guid.parse('545f1841-4cab-44fc-bd9d-bda241487c56'), generation: 1 };
const map = new Map<Constructor<any>, Artifact>();
map.set(MyType, artifact);
const artifacts = new Artifacts(map);

export default {
    artifacts,
    type: MyType,
    artifact
};
