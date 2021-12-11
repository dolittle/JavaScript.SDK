// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Version as SdkVersion } from '@dolittle/sdk.execution';
import { Version as PbVersion } from '@dolittle/contracts/Versioning/Version_pb';

import './extensions';

/**
 * Convert to protobuf representation.
 * @param {SdkVersion} input - The version to convert.
 * @returns {PbVersion} The converted version.
 */
export function toProtobuf(input: SdkVersion): PbVersion {
    const version = new PbVersion();
    version.setMajor(input.major);
    version.setMinor(input.minor);
    version.setPatch(input.patch);
    version.setBuild(input.build);
    version.setPrereleasestring(input.preReleaseString);

    return version;
}

/**
 * Convert to SDK representation.
 * @param {PbVersion} input - The version to convert.
 * @returns {SdkVersion} The converted version.
 */
export function toSDK(input?: PbVersion): SdkVersion {
    if (!input) {
        return SdkVersion.notSet;
    }
    const version = new SdkVersion(
        input.getMajor(),
        input.getMinor(),
        input.getPatch(),
        input.getBuild(),
        input.getPrereleasestring()
    );

    return version;
}
SdkVersion.prototype.toProtobuf = function () {
    return toProtobuf(this);
};
PbVersion.prototype.toSDK = function () {
    return toSDK(this);
};
