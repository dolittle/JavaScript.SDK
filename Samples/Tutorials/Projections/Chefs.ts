// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// Sample code for the tutorial at https://dolittle.io/tutorials/getting-started/projections/

import { Chef } from './Chef';

export class Chefs {
    constructor(
        public chefArray: Chef[] = []
    ) {}
}
