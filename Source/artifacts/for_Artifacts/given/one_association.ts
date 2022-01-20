// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { artifacts, artifact_type, artifact_type_id } from './artifacts';

class my_type {}
const type = new artifact_type(artifact_type_id.from('545f1841-4cab-44fc-bd9d-bda241487c56'));

export default {
    get artifacts() {
        const map = new artifacts();
        map.associate(my_type, type);
        return map;
    },
    class_type: my_type,
    artifact_type: type
};
