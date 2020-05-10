// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Artifacts } from '../../Artifacts';
import { ArtifactId } from '../../ArtifactId';
import { Artifact } from '../../Artifact';

class MyType {}

const artifact = {id: ArtifactId.create(), generation: 1};
const map = new Map<Function, Artifact>();
map.set(MyType, artifact);
const artifacts = new Artifacts(map);

export default {
    artifacts: artifacts,
    type: MyType
}
