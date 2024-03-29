// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { EventContext } from '@dolittle/sdk.events';

/**
 * Defines the callback for a filter that creates an unpartitioned stream.
 */
export type FilterEventCallback = (event: any, context: EventContext) => boolean | Promise<boolean>;
