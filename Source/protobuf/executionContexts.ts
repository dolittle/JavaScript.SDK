// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ExecutionContext as SdkExecutionContext, Claims } from '@dolittle/sdk.execution';
import { ExecutionContext as PbExecutionContext } from '@dolittle/runtime.contracts/Fundamentals/Execution/ExecutionContext_pb';
import { Claim as PbClaim } from '@dolittle/runtime.contracts/Fundamentals/Security/Claim_pb';

import claims from './claims';
import guids from './guids';
import versions from './versions';

/**
 * Convert to protobuf representation
 * @param {SdkExecutionContext} input Input execution context
 * @returns {PbExecutionContext} protobuf representation
 */
function toProtobuf(input: SdkExecutionContext): PbExecutionContext {
    const result = new PbExecutionContext();
    result.setMicroserviceid(guids.toProtobuf(input.microserviceId));
    result.setTenantid(guids.toProtobuf(input.tenantId));
    result.setVersion(versions.toProtobuf(input.version));
    result.setCorrelationid(guids.toProtobuf(input.correlationId));
    result.setEnvironment(input.environment);
    result.setClaimsList(claims.toProtobuf(input.claims) as PbClaim[]);
    return result;
}

/**
 * Convert to SDK representation
 * @param {SdkExecutionContext} input Input execution context
 * @returns {PbExecutionContext} SDK representation
 */
function toSDK(input: PbExecutionContext): SdkExecutionContext {
    const microserviceId = guids.toSDK(input.getMicroserviceid());
    const tenantId = guids.toSDK(input.getTenantid());
    const version = versions.toSDK(input.getVersion());
    const environment = input.getEnvironment();
    const correlationId = guids.toSDK(input.getCorrelationid());
    const convertedClaims = new Claims(input.getClaimsList().map(claim => claims.toSDK(claim)));

    return new SdkExecutionContext(
        microserviceId,
        tenantId,
        version,
        environment,
        correlationId,
        convertedClaims);
}

export default {
    toProtobuf,
    toSDK
};

declare module '@dolittle/sdk.execution' {
    interface ExecutionContext {
        toProtobuf(): PbExecutionContext;
    }
}

/**
 * Convert to protobuf representation
 * @param {SdkExecutionContext} input Input execution context
 * @returns {PbExecutionContext} protobuf representation
 */
SdkExecutionContext.prototype.toProtobuf = function () {
    return toProtobuf(this);
};

declare module '@dolittle/runtime.contracts/Fundamentals/Execution/ExecutionContext_pb' {
    interface ExecutionContext {
        toSDK(): SdkExecutionContext;
    }
}

/**
 * Convert to SDK representation
 * @param {SdkExecutionContext} input Input execution context
 * @returns {PbExecutionContext} SDK representation
 */
PbExecutionContext.prototype.toSDK = function () {
    return toSDK(this);
};
