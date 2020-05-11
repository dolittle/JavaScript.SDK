// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { Uuid } from '@dolittle/runtime.contracts/Fundamentals/Protobuf/Uuid_pb';

export function toProtobuf(guid: Guid) {
    const uuid = new Uuid();
    uuid.setValue(new Uint8Array(guid.bytes));
    return uuid;
}
