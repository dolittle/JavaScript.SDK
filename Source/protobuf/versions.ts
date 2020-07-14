// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Version as SdkVersion } from '@dolittle/sdk.execution';
import { Version as PbVersion } from '@dolittle/runtime.contracts/Fundamentals/Versioning/Version_pb';

/**
 * Convert to protobuf representation
 * @returns {PbVersion}
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
 * Convert to SDK representation
 * @returns {SdkVersion}
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
 * Convert to protobuf representation
 * @returns {PbVersion}
 */
SdkVersion.prototype.toProtobuf = function () {
    return toProtobuf(this);
};


declare module '@dolittle/runtime.contracts/Fundamentals/Versioning/Version_pb' {
    interface Version {
        toSDK(): SdkVersion;
    }
}
/**
 * Convert to SDK representation
 * @returns {SdkVersion}
 */
PbVersion.prototype.toSDK = function () {
    return toSDK(this);
};
