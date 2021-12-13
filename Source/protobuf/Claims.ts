// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Claim as SdkClaim, Claims as SdkClaims } from '@dolittle/sdk.execution';
import { Claim as PbClaim } from '@dolittle/contracts/Security/Claim_pb';

/**
 * Convert a claim to protobuf representation.
 * @param {SdkClaim | SdkClaims} input - The claim to convert.
 * @returns {PbClaim} The converted claim.
 */
export function toProtobuf(input: SdkClaim): PbClaim;
/**
 * Convert claims to protobuf representation.
 * @param {SdkClaims} input - The claims to convert.
 * @returns {PbClaim[]} The converted claims.
 */
export function toProtobuf(input: SdkClaims): PbClaim[];
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
 * Convert a claim to SDK representation.
 * @param {PbClaim} input - The claim to convert.
 * @returns {SdkClaim} The converted claim.
 */
export function toSDK(input: PbClaim): SdkClaim;
/**
 * Convert claims to SDK representation.
 * @param {PbClaim[]} input - The claims to convert.
 * @returns {SdkClaims} The converted claims.
 */
export function toSDK(input: PbClaim[]): SdkClaims;
export function toSDK(input: PbClaim | PbClaim[]): SdkClaim | SdkClaims {
    if (Array.isArray(input)) {
        return new SdkClaims(input.map(_ => toSDK(_)));
    } else {
        const claim = new SdkClaim(input.getKey(), input.getValue(), input.getValuetype());
        return claim;
    }
}
