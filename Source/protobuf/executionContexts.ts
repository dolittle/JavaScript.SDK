// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ExecutionContext as SdkExecutionContext, Claims, TenantId, MicroserviceId, CorrelationId, Environment } from '@dolittle/sdk.execution';

import { ExecutionContext as PbExecutionContext } from '@dolittle/contracts/Execution/ExecutionContext_pb';
import { CallRequestContext } from '@dolittle/contracts/Services/CallContext_pb';

import './extensions';
import './claims';
import './guids';
import './versions';

/**
 * Convert to protobuf representation.
 * @param {SdkExecutionContext} input - Input execution context.
 * @returns {PbExecutionContext} Protobuf representation.
 */
export function toProtobuf(input: SdkExecutionContext): PbExecutionContext {
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
 * Convert {@link ExecutionContext} to a {@link CallRequestContext}.
 * @param {SdkExecutionContext} executionContext - Execution context to convert from.
 * @returns {CallRequestContext} The converted call request context.
 */
export function toCallContext(executionContext: SdkExecutionContext): CallRequestContext {
    const callContext = new CallRequestContext();
    callContext.setExecutioncontext(executionContext.toProtobuf());
    return callContext;
}

/**
 * Convert to SDK representation.
 * @param {SdkExecutionContext} input - Input execution context.
 * @returns {PbExecutionContext} SDK representation.
 */
export function toSDK(input: PbExecutionContext): SdkExecutionContext {
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

SdkExecutionContext.prototype.toProtobuf = function () {
    return toProtobuf(this);
};

SdkExecutionContext.prototype.toCallContext = function () {
    return toCallContext(this);
};

PbExecutionContext.prototype.toSDK = function () {
    return toSDK(this);
};
