// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Failure as PbFailure } from '@dolittle/contracts/Protobuf/Failure_pb';

import { Failure as SdkFailure } from './Failure';
import { MissingFailureIdentifier } from './MissingFailureIdentifier';

import './extensions';
import './guids';

/**
 * Convert to protobuf representation.
 * @param {SdkFailure} input - The failure to convert.
 * @returns {PbFailure} The converted failure.
 */
export function toProtobuf(input: SdkFailure): PbFailure {
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
export function toSDK(input?: PbFailure): SdkFailure | undefined {
    if (!input) {
        return undefined;
    }
    const guid = input.getId()?.toSDK();
    if (!guid) {
        throw new MissingFailureIdentifier();
    }
    return SdkFailure.from(guid, input.getReason());
}

SdkFailure.prototype.toProtobuf = function () {
    return toProtobuf(this);
};

PbFailure.prototype.toSDK = function () {
    return toSDK(this)!;
};
