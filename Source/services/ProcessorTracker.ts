// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { concat, merge, Observable, Subject, Subscription, throwError } from 'rxjs';
import { endWith, takeUntil } from 'rxjs/operators';

import { Cancellation } from '@dolittle/sdk.resilience';

import { ITrackProcessors } from './ITrackProcessors';
import { WaitingForProcessorsCompletionCancelled } from './WaitingForProcessorsCompletionCancelled';

/**
 * Represents an implementation of {@link ITrackProcessors}.
 */
export class ProcessorTracker extends ITrackProcessors {
    private readonly _runningProcessors: Set<Observable<void>> = new Set();

    /** @inheritdoc */
    registerProcessor(processor: Subscription): void {
        const proxy = new Subject<void>();
        this._runningProcessors.add(proxy);

        processor.add(() => {
            this._runningProcessors.delete(proxy);
            proxy.complete();
        });
    }

    /** @inheritdoc */
    allProcessorsCompleted(cancellation: Cancellation = Cancellation.default): Promise<void> {
        const allCompleted = merge(...this._runningProcessors).pipe(endWith(true));
        const errorOnCancellation = concat(cancellation, throwError(new WaitingForProcessorsCompletionCancelled()));

        return errorOnCancellation.pipe(takeUntil(allCompleted)).toPromise();
    }
}
