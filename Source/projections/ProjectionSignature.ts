// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { EventContext } from '@dolittle/sdk.events';

/**
 * Represents the signature for a projection's on() method
 */
export type ProjectionSignature<T = any> = (readModel: any, event: T, context: EventContext) => void | Promise<void>;
