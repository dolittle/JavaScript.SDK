// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { MonoTypeOperatorFunction } from 'rxjs';

export type RetryOperator = MonoTypeOperatorFunction<Error>;