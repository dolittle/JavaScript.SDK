// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Claim as SdkClaim, Claims } from '@dolittle/sdk.execution';
import { Claim as PbClaim } from '@dolittle/runtime.contracts/Fundamentals/Security/Claim_pb';

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
 */
SdkClaim.prototype.toProtobuf = function () {
    const claim = new PbClaim();
    claim.setKey(this.key);
    claim.setValue(this.value);
    claim.setValuetype(this.valueType);
    return claim;
};

/**
 * Convert to protobuf representation
 */
Claims.prototype.toProtobuf = function () {
    const claims: PbClaim[] = [];

    for (const claim of this) {
        claims.push(claim.toProtobuf());
    }

    return claims;
};


declare module '@dolittle/runtime.contracts/Fundamentals/Security/Claim_pb' {
    interface Claim {
        toSDK(): SdkClaim;
    }
}

/**
 * Convert to SDK representation
 */
PbClaim.prototype.toSDK = function() {
    const claim = new SdkClaim();
    claim.key = this.getKey();
    claim.value = this.getValue();
    claim.valueType = this.getValuetype();
    return claim;
};

