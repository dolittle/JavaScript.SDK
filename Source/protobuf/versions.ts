// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Version as SdkVersion } from '@dolittle/sdk.execution';
import { Version as PbVersion } from '@dolittle/contracts/Versioning/Version_pb';

/**
 * Convert to protobuf representation.
 * @param {SdkVersion} input - The version to convert.
 * @returns {PbVersion} The converted version.
 */
function toProtobuf(input: SdkVersion): PbVersion {
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
function toSDK(input?: PbVersion): SdkVersion {
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

export default {
    toProtobuf,
    toSDK
};

declare module '@dolittle/sdk.execution' {
    interface Version {
        toProtobuf(): PbVersion;
    }
}

/**
 * Convert to protobuf representation.
 * @returns {PbVersion} The converted version.
 */
SdkVersion.prototype.toProtobuf = function () {
    return toProtobuf(this);
};

declare module '@dolittle/contracts/Versioning/Version_pb' {
    interface Version {
        toSDK(): SdkVersion;
    }
}
/**
 * Convert to SDK representation.
 * @returns {SdkVersion} The converted version.
 */
PbVersion.prototype.toSDK = function () {
    return toSDK(this);
};
