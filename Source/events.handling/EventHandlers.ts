// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Cancellation, retryPipe } from '@dolittle/sdk.resilience';
import { delay } from 'rxjs/operators';
import { Logger } from 'winston';
import { IEventHandlers } from './IEventHandlers';
import { EventHandlerProcessor } from './Internal';

/**
 * Represents an implementation of {IEventHandlers}.
 */
export class EventHandlers extends IEventHandlers {

    /**
     * Initializes an instance of {@link EventHandlers}.
     * @param {Logger} _logger - For logging.
     */
    constructor(private readonly _logger: Logger) {
        super();
    }

    /** @inheritdoc */
    register(eventHandlerProcessor: EventHandlerProcessor, cancellation = Cancellation.default): void {
        eventHandlerProcessor.registerForeverWithPolicy(retryPipe(delay(1000)), this._logger, cancellation).subscribe({
            error: (error: Error) => {
                this._logger.error(`Failed to register event handler: ${error}`);
            },
            complete: () => {
                this._logger.error(`Event handler registration completed.`);
            }
        });
    }
}
