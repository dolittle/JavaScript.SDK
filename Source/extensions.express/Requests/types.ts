// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

declare namespace Express {
    /** @inheritdoc */
    export interface Request {
        /**
         * Hello.
         */
        readonly dolittle: number;
    }
}
