// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Version as SdkVersion } from '@dolittle/sdk.execution';
import { Version as PbVersion } from '@dolittle/runtime.contracts/Fundamentals/Versioning/Version_pb';

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
    const version = new PbVersion();
    version.setMajor(this.major);
    version.setMinor(this.minor);
    version.setPatch(this.patch);
    version.setBuild(this.build);
    version.setPrereleasestring(this.preReleaseString);

    return version;
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
PbVersion.prototype.toSDK = function() {
    const version = new SdkVersion(
        this.getMajor(),
        this.getMinor(),
        this.getPatch(),
        this.getBuild(),
        this.getPrereleasestring()
    );

    return version;
};
