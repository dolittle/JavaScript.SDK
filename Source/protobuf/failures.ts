// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Failure as PbFailure } from '@dolittle/runtime.contracts/Fundamentals/Protobuf/Failure_pb';
import { Guid } from '@dolittle/rudiments';

import { Failure as SdkFailure } from './Failure';
import { MissingFailureIdentifier } from './MissingFailureIdentifier';
import guids from './guids';

/**
 * Convert to protobuf representation
 * @returns {PbFailure} Protobuf failure
 */
function toProtobuf(input: SdkFailure): PbFailure {
    const artifact = new PbFailure();
    artifact.setId(guids.toProtobuf(input.id.value));
    artifact.setReason(input.reason.value);
    return artifact;
}

/**
 * Convert to SDK representation
 * @returns {SdkFailure}
 */
function toSDK(input?: PbFailure): SdkFailure | undefined {
    if (!input) {
        return undefined;
    }
    const uuid = input.getId()?.getValue_asU8();
    if (!uuid) {
        throw new MissingFailureIdentifier();
    }
    return SdkFailure.from(new Guid(uuid), input.getReason());
}

export default {
    toProtobuf,
    toSDK
};

declare module './Failure' {
    interface Failure {
        toProtobuf(): PbFailure;
    }
}

/**
 * Convert to protobuf representation
 * @returns {PbFailure}
 */
SdkFailure.prototype.toProtobuf = function () {
    return toProtobuf(this);
};

declare module '@dolittle/runtime.contracts/Fundamentals/Protobuf/Failure_pb' {
    interface Failure {
        toSDK(): SdkFailure | undefined
    }
}

/**
 * Convert to SDK representation
 * @returns {SdkFailure}
 */
PbFailure.prototype.toSDK = function () {
    return toSDK(this);
};
