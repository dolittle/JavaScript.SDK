// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ExecutionContext } from '@dolittle/sdk.execution';
import { ExecutionContext as ProtobufExecutionContext } from '@dolittle/runtime.contracts/Fundamentals/Execution/ExecutionContext_pb';

export interface IExecutionContextConverter {
    toProtobuf(executionContext: ExecutionContext): ProtobufExecutionContext;
    fromProtobuf(executionContext: ProtobufExecutionContext): ExecutionContext;
}
