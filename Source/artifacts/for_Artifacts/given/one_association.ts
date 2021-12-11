// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

import { artifacts, artifact_type, artifact_type_id, artifact_type_map } from './artifacts';

class my_type {}

const type = new artifact_type(artifact_type_id.from('545f1841-4cab-44fc-bd9d-bda241487c56'));
const map = new artifact_type_map<Constructor<any>>();
map.set(type, my_type);

export default {
    artifacts: new artifacts(map),
    class_type: my_type,
    artifact_type: type
};
