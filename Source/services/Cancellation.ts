// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Observable, NEVER } from 'rxjs';

export class Cancellation extends Observable<void> {
    static default: Cancellation = NEVER;
}
