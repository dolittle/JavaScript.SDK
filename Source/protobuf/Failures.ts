// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Failure as PbFailure } from '@dolittle/contracts/Protobuf/Failure_pb';

import { Failure as SdkFailure } from './Failure';
import { MissingFailureIdentifier } from './MissingFailureIdentifier';

import * as Guids from './Guids';

/**
 * Convert a failure to protobuf representation.
 * @param {SdkFailure} input - The failure to convert.
 * @returns {PbFailure} The converted failure.
 */
export function toProtobuf(input: SdkFailure): PbFailure {
    const artifact = new PbFailure();
    artifact.setId(Guids.toProtobuf(input.id.value));
    artifact.setReason(input.reason.value);
    return artifact;
}

/**
 * Convert a failure to SDK representation.
 * @param {PbFailure} input - The failure to convert.
 * @returns {SdkFailure} The converted failure.
 */
export function toSDK(input: PbFailure): SdkFailure;
/**
 * An overload to simplify usage of this function.
 * @param {undefined} input - Undefined.
 * @returns {undefined} Undefined.
 */
export function toSDK(input: undefined): undefined;
/**
 * Convert a optional failure to SDK representation.
 * @param {PbFailure?} [input] - The optional failure to convert.
 * @returns {SdkFailure|undefined} The converted failure.
 */
export function toSDK(input?: PbFailure): SdkFailure | undefined;
export function toSDK(input?: PbFailure): SdkFailure | undefined {
    if (!input) {
        return undefined;
    }
    const guid = Guids.toSDK(input.getId());
    if (!guid) {
        throw new MissingFailureIdentifier();
    }
    return SdkFailure.from(guid, input.getReason());
}
