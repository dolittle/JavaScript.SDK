// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Claim as SdkClaim, Claims as SdkClaims } from '@dolittle/sdk.execution';
import { Claim as PbClaim } from '@dolittle/contracts/Security/Claim_pb';

import './extensions';

/**
 * Convert to protobuf representation.
 * @param {SdkClaim | SdkClaims} input - The claim(s) to convert.
 * @returns {PbClaim} The converted claims.
 */
export function toProtobuf(input: SdkClaim | SdkClaims): PbClaim | PbClaim[] {
    if (input instanceof SdkClaim) {
        const claim = new PbClaim();
        claim.setKey(input.key);
        claim.setValue(input.value);
        claim.setValuetype(input.valueType);
        return claim;
    } else {
        const claims: PbClaim[] = [];

        for (const claim of input) {
            claims.push(toProtobuf(claim) as PbClaim);
        }

        return claims;
    }
}

/**
 * Convert to SDK representation.
 * @param {PbClaim} input - The claim to convert.
 * @returns {SdkClaim} The converted claim.
 */
export function toSDK(input: PbClaim): SdkClaim {
    const claim = new SdkClaim(input.getKey(), input.getValue(), input.getValuetype());
    return claim;
}

SdkClaim.prototype.toProtobuf = function () {
    return toProtobuf(this) as PbClaim;
};

SdkClaims.prototype.toProtobuf = function () {
    return toProtobuf(this) as PbClaim[];
};

PbClaim.prototype.toSDK = function () {
    return toSDK(this);
};
