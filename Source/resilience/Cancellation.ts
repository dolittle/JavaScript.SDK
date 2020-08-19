// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Observable, NEVER } from 'rxjs';

/**
 * Represents a possible cancellation.
 */
export class Cancellation extends Observable<void> {

    /**
     * Default cancellation, which is never.
     */
    static default: Cancellation = NEVER;
}
