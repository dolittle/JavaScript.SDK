// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { IServiceProvider } from '@dolittle/sdk.common/DependencyInversion';
import { EventContext } from '@dolittle/sdk.events';

/**
 * Represents the signature for an event handler.
 */
export type EventHandlerSignature<T = any> = (event: T, context: EventContext, services: IServiceProvider, logger: Logger) => void | Promise<void>;
