// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { request } from 'express';

Object.defineProperty(request, 'dolittle', {
    configurable: false,
    enumerable: false,
    get() {
        console.log('Getter', this);
    }
});
