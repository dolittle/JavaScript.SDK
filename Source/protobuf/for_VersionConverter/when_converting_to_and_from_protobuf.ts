// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Version } from '@dolittle/sdk.execution';

import '../VersionConverters';

describe('when converting to and from protobuf', () => {
    const version = new Version(42,43,44,45,'alpha');
    const result = version.toProtobuf().toSDK();

    it('should have same major', () => result.major.should.equal(version.major));
    it('should have same minor', () => result.minor.should.equal(version.minor));
    it('should have same patch', () => result.patch.should.equal(version.patch));
    it('should have same build', () => result.build.should.equal(version.build));
    it('should have same pre release string', () => result.preReleaseString.should.equal(version.preReleaseString));
});
