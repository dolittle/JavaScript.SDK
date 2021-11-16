// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ExecutionContext } from '@dolittle/sdk.execution';
import { CallRequestContext } from '@dolittle/contracts/Services/CallContext_pb';
import executionContexts from './executionContexts';

/**
 * Convert {@link ExecutionContext} to a {@link CallRequestContext}.
 * @param {ExecutionContext} executionContext - Execution context to convert from.
 * @returns {CallRequestContext} The converted call request context.
 */
function toProtobuf(executionContext: ExecutionContext): CallRequestContext {
    const callContext = new CallRequestContext();
    callContext.setExecutioncontext(executionContexts.toProtobuf(executionContext));
    return callContext;
}

export default {
    toProtobuf
};
