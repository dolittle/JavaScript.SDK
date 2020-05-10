// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Version } from '@dolittle/sdk.execution';
import { Version as PbVersion } from '@dolittle/runtime.contracts/Fundamentals/Versioning/Version_pb';

declare module '@dolittle/sdk.execution' {
    interface Version {
        toProtobuf(): PbVersion;
    }
}

Version.prototype.toProtobuf = function () {
    const version = new PbVersion();
    version.setMajor(this.major);
    version.setMinor(this.minor);
    version.setPatch(this.patch);
    version.setBuild(this.build);
    version.setPrereleasestring(this.preReleaseString);

    return version;
};

