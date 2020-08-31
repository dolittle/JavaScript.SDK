// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Claims, Claim } from '@dolittle/sdk.execution';

import '../index';

describe('when converting claims to protobuf', () => {
    const claimsArray: Claim[] = [
        new Claim('first', 'first value', 'first value type'),
        new Claim('second', 'second value', 'second value type')
    ];
    const claims = new Claims(claimsArray);

    const result = claims.toProtobuf();

    it('should have an array of 2', () => result.length.should.equal(2));
    it('should hold first claims key', () => result[0].getKey().should.equal(claimsArray[0].key));
    it('should hold first claims value', () => result[0].getValue().should.equal(claimsArray[0].value));
    it('should hold first claims value type', () => result[0].getValuetype().should.equal(claimsArray[0].valueType));
    it('should hold second claims key', () => result[1].getKey().should.equal(claimsArray[1].key));
    it('should hold second claims value', () => result[1].getValue().should.equal(claimsArray[1].value));
    it('should hold second claims value type', () => result[1].getValuetype().should.equal(claimsArray[1].valueType));
});
