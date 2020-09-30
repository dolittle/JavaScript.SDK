// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { EventType } from '../../EventType';
import { EventTypeId } from '../../EventTypeId';
import { EventTypeMap } from '../../EventTypeMap';
import { EventTypes } from '../../EventTypes';

class MyType {}

const eventType = new EventType(EventTypeId.from('545f1841-4cab-44fc-bd9d-bda241487c56'));
const map = new EventTypeMap();
map.set(eventType, MyType);
const eventTypes = new EventTypes(map);

export default {
    eventTypes,
    type: MyType,
    eventType
};
