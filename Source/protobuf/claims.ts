// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Claim as SdkClaim, Claims } from '@dolittle/sdk.execution';
import { Claim as PbClaim } from '@dolittle/contracts/Security/Claim_pb';

/**
 * Convert to protobuf representation
 * @returns {PbClaim}
 */
function toProtobuf(input: SdkClaim | Claims): PbClaim | PbClaim[] {
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
 * Convert to SDK representation
 * @returns {SdkClaim}
 */
function toSDK(input: PbClaim): SdkClaim {
    const claim = new SdkClaim(input.getKey(), input.getValue(), input.getValuetype());
    return claim;
}

export default {
    toProtobuf,
    toSDK
};


declare module '@dolittle/sdk.execution' {
    interface Claim {
        toProtobuf(): PbClaim;
    }

    interface Claims {
        toProtobuf(): PbClaim[];
    }
}


/**
 * Convert to protobuf representation
 * @returns {PbClaim}
 */
SdkClaim.prototype.toProtobuf = function () {
    return toProtobuf(this) as PbClaim;
};

/**
 * Convert to protobuf representation
 * @returns {PbClaim[]}
 */
Claims.prototype.toProtobuf = function () {
    return toProtobuf(this) as PbClaim[];
};


declare module '@dolittle/contracts/Security/Claim_pb' {
    interface Claim {
        toSDK(): SdkClaim;
    }
}

/**
 * Convert to SDK representation
 * @returns {SdkClaim}
 */
PbClaim.prototype.toSDK = function () {
    return toSDK(this);
};
