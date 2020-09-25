// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';
import { Artifact } from '../../Artifact';
import { Artifacts } from '../../Artifacts';

class MyType {}

const artifact = Artifact.from('545f1841-4cab-44fc-bd9d-bda241487c56');
const map = new Map<Constructor<any>, Artifact>();
map.set(MyType, artifact);
const artifacts = new Artifacts(map);

export default {
    artifacts,
    type: MyType,
    artifact
};
