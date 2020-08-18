// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { EventContext } from '@dolittle/sdk.events';

/**
 * Represents the signature for an event handler.
 */
export type EventHandlerSignature<T> = (event: T, context: EventContext) => void | Promise<void>;

