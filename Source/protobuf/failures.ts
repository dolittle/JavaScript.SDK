// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Failure as PbFailure } from '@dolittle/contracts/Protobuf/Failure_pb';

import { Failure as SdkFailure } from './Failure';
import { MissingFailureIdentifier } from './MissingFailureIdentifier';

import './guids';

/**
 * Convert to protobuf representation.
 * @param {SdkFailure} input - The failure to convert.
 * @returns {PbFailure} The converted failure.
 */
function toProtobuf(input: SdkFailure): PbFailure {
    const artifact = new PbFailure();
    artifact.setId(input.id.value.toProtobuf());
    artifact.setReason(input.reason.value);
    return artifact;
}

/**
 * Convert to SDK representation.
 * @param {PbFailure} input - The failure to convert.
 * @returns {SdkFailure} The converted failure.
 */
function toSDK(input?: PbFailure): SdkFailure | undefined {
    if (!input) {
        return undefined;
    }
    const guid = input.getId()?.toSDK();
    if (!guid) {
        throw new MissingFailureIdentifier();
    }
    return SdkFailure.from(guid, input.getReason());
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
 * Convert to protobuf representation.
 * @returns {PbFailure} The converted failure.
 */
SdkFailure.prototype.toProtobuf = function () {
    return toProtobuf(this);
};

declare module '@dolittle/contracts/Protobuf/Failure_pb' {
    interface Failure {
        toSDK(): SdkFailure
    }
}

/**
 * Convert to SDK representation.
 * @returns {SdkFailure} The converted failure.
 */
PbFailure.prototype.toSDK = function () {
    return toSDK(this)!;
};
