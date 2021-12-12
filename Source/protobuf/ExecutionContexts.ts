// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ExecutionContext as SdkExecutionContext, TenantId, MicroserviceId, CorrelationId, Environment } from '@dolittle/sdk.execution';

import { ExecutionContext as PbExecutionContext } from '@dolittle/contracts/Execution/ExecutionContext_pb';
import { CallRequestContext } from '@dolittle/contracts/Services/CallContext_pb';

import * as Claims from './Claims';
import * as Guids from  './Guids';
import * as Versions from './Versions';

/**
 * Convert to protobuf representation.
 * @param {SdkExecutionContext} input - Input execution context.
 * @returns {PbExecutionContext} Protobuf representation.
 */
export function toProtobuf(input: SdkExecutionContext): PbExecutionContext {
    const result = new PbExecutionContext();
    result.setMicroserviceid(Guids.toProtobuf(input.microserviceId.value));
    result.setTenantid(Guids.toProtobuf(input.tenantId.value));
    result.setVersion(Versions.toProtobuf(input.version));
    result.setCorrelationid(Guids.toProtobuf(input.correlationId.value));
    result.setEnvironment(input.environment.value);
    result.setClaimsList(Claims.toProtobuf(input.claims));
    return result;
}

/**
 * Convert {@link ExecutionContext} to a {@link CallRequestContext}.
 * @param {SdkExecutionContext} executionContext - Execution context to convert from.
 * @returns {CallRequestContext} The converted call request context.
 */
export function toCallContext(executionContext: SdkExecutionContext): CallRequestContext {
    const callContext = new CallRequestContext();
    callContext.setExecutioncontext(toProtobuf(executionContext));
    return callContext;
}

/**
 * Convert to SDK representation.
 * @param {SdkExecutionContext} input - Input execution context.
 * @returns {PbExecutionContext} SDK representation.
 */
export function toSDK(input: PbExecutionContext): SdkExecutionContext {
    const microserviceId = MicroserviceId.from(Guids.toSDK(input.getMicroserviceid()));
    const tenantId = TenantId.from(Guids.toSDK(input.getTenantid()));
    const version = Versions.toSDK(input.getVersion());
    const environment = Environment.from(input.getEnvironment());
    const correlationId = CorrelationId.from(Guids.toSDK(input.getCorrelationid()));
    const claims = Claims.toSDK(input.getClaimsList());

    return new SdkExecutionContext(
        microserviceId,
        tenantId,
        version,
        environment,
        correlationId,
        claims);
}
