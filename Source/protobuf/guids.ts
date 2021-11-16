// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { Uuid } from '@dolittle/contracts/Protobuf/Uuid_pb';

/**
 * Convert to protobuf representation
 * @returns {Uuid}
 */
function toProtobuf(guid: Guid): Uuid {
    const uuid = new Uuid();
    uuid.setValue(new Uint8Array(guid.bytes));
    return uuid;
}

/**
 * Convert to SDK representation
 * @returns {Guid}
 */
function toSDK(uuid?: Uuid): Guid {
    if (!uuid) {
        return Guid.empty;
    }
    return new Guid(uuid.getValue_asU8());
}

export default {
    toProtobuf,
    toSDK
};

declare module '@dolittle/rudiments' {
    interface Guid {
        toProtobuf(): Uuid
    }
}
/**
 * Convert to protobuf representation
 * @returns {Uuid}
 */
Guid.prototype.toProtobuf = function () {
    return toProtobuf(this);
};

declare module '@dolittle/contracts/Protobuf/Uuid_pb' {
    interface Uuid {
        toSDK(): Guid
    }
}
/**
 * Convert to SDK representation
 * @returns {Guid}
 */
Uuid.prototype.toSDK = function () {
    return toSDK(this);
};
