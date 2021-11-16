// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ExecutionContext as SdkExecutionContext, Claims, TenantId, MicroserviceId, CorrelationId, Environment } from '@dolittle/sdk.execution';
import { ExecutionContext as PbExecutionContext } from '@dolittle/contracts/Execution/ExecutionContext_pb';
import { Claim as PbClaim } from '@dolittle/contracts/Security/Claim_pb';

import claims from './claims';
import guids from './guids';
import versions from './versions';

/**
 * Convert to protobuf representation.
 * @param {SdkExecutionContext} input - Input execution context.
 * @returns {PbExecutionContext} Protobuf representation.
 */
function toProtobuf(input: SdkExecutionContext): PbExecutionContext {
    const result = new PbExecutionContext();
    result.setMicroserviceid(guids.toProtobuf(input.microserviceId.value));
    result.setTenantid(guids.toProtobuf(input.tenantId.value));
    result.setVersion(versions.toProtobuf(input.version));
    result.setCorrelationid(guids.toProtobuf(input.correlationId.value));
    result.setEnvironment(input.environment.value);
    result.setClaimsList(claims.toProtobuf(input.claims) as PbClaim[]);
    return result;
}

/**
 * Convert to SDK representation.
 * @param {SdkExecutionContext} input - Input execution context.
 * @returns {PbExecutionContext} SDK representation.
 */
function toSDK(input: PbExecutionContext): SdkExecutionContext {
    const microserviceId = MicroserviceId.from(guids.toSDK(input.getMicroserviceid()));
    const tenantId = TenantId.from(guids.toSDK(input.getTenantid()));
    const version = versions.toSDK(input.getVersion());
    const environment = Environment.from(input.getEnvironment());
    const correlationId = CorrelationId.from(guids.toSDK(input.getCorrelationid()));
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
 * Convert to protobuf representation.
 * @returns {PbExecutionContext} Protobuf representation.
 */
SdkExecutionContext.prototype.toProtobuf = function () {
    return toProtobuf(this);
};

declare module '@dolittle/contracts/Execution/ExecutionContext_pb' {
    interface ExecutionContext {
        toSDK(): SdkExecutionContext;
    }
}

/**
 * Convert to SDK representation.
 * @returns {PbExecutionContext} SDK representation.
 */
PbExecutionContext.prototype.toSDK = function () {
    return toSDK(this);
};
