// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ExecutionContext } from '@dolittle/sdk.execution';
import { CallRequestContext } from '@dolittle/contracts/Services/CallContext_pb';

import './executionContexts';

/**
 * Convert {@link ExecutionContext} to a {@link CallRequestContext}.
 * @param {ExecutionContext} executionContext - Execution context to convert from.
 * @returns {CallRequestContext} The converted call request context.
 */
function toCallContext(executionContext: ExecutionContext): CallRequestContext {
    const callContext = new CallRequestContext();
    callContext.setExecutioncontext(executionContext.toProtobuf());
    return callContext;
}

export default {
    toCallContext
};
declare module '@dolittle/sdk.execution' {
    interface ExecutionContext {
        toCallContext(): CallRequestContext;
    }
}

/**
 * Convert to protobuf representation.
 * @returns {CallRequestContext} Protobuf representation.
 */
 ExecutionContext.prototype.toCallContext = function () {
    return toCallContext(this);
};
