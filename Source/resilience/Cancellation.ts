// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Observable, NEVER } from 'rxjs';

/**
 * Represents a possible cancellation.
 */
export class Cancellation extends Observable<void> {
    /**
     * Creates a new instance of the {@link Cancellation} class.
     * @param {Observable<void>} source - The source observable that indicates when a cancellation has occured.
     */
    constructor(source: Observable<void>) {
        super(source.subscribe);
    }

    /**
     * Default cancellation, which is never.
     */
    static default: Cancellation = new Cancellation(NEVER);
}
