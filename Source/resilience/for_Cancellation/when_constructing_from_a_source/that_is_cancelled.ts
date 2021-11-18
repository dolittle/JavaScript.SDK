// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { describeThis } from '@dolittle/typescript.testing';
import { Subject } from 'rxjs';
import { Cancellation } from '../../index';

describeThis(__filename, () => {
    const source = new Subject<void>();
    const cancellation = new Cancellation(source);

    let cancelled = false;
    cancellation.subscribe({
        complete: () => cancelled = true,
    });
    source.complete();

    it('should be cancelled', () => cancelled.should.be.true);
});
