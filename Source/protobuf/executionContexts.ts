// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ExecutionContext as SdkExecutionContext, Claims, TenantId, MicroserviceId, CorrelationId, Environment } from '@dolittle/sdk.execution';
import { ExecutionContext as PbExecutionContext } from '@dolittle/contracts/Execution/ExecutionContext_pb';

import './claims';
import './guids';
import './versions';

/**
 * Convert to protobuf representation.
 * @param {SdkExecutionContext} input - Input execution context.
 * @returns {PbExecutionContext} Protobuf representation.
 */
function toProtobuf(input: SdkExecutionContext): PbExecutionContext {
    const result = new PbExecutionContext();
    result.setMicroserviceid(input.microserviceId.value.toProtobuf());
    result.setTenantid(input.tenantId.value.toProtobuf());
    result.setVersion(input.version.toProtobuf());
    result.setCorrelationid(input.correlationId.value.toProtobuf());
    result.setEnvironment(input.environment.value);
    result.setClaimsList(input.claims.toProtobuf());
    return result;
}

/**
 * Convert to SDK representation.
 * @param {SdkExecutionContext} input - Input execution context.
 * @returns {PbExecutionContext} SDK representation.
 */
function toSDK(input: PbExecutionContext): SdkExecutionContext {
    const microserviceId = MicroserviceId.from(input.getMicroserviceid()!.toSDK());
    const tenantId = TenantId.from(input.getTenantid()!.toSDK());
    const version = input.getVersion()!.toSDK();
    const environment = Environment.from(input.getEnvironment());
    const correlationId = CorrelationId.from(input.getCorrelationid()!.toSDK());
    const convertedClaims = new Claims(input.getClaimsList().map(claim => claim.toSDK()));

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
