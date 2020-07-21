// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Observable } from 'rxjs';
import { retryWhen } from 'rxjs/operators';

import { RetryOperator } from './RetryOperator';

export type RetryPolicy = (errors: Observable<Error>) => Observable<Error>;

export function retryPipe(...operators: RetryOperator[]): RetryPolicy {
    return (errors: Observable<Error>) => {
        let result = errors;
        for (const operator of operators) {
            result = result.pipe(operator);
        }
        return result;
    };
}

export function retryWithPolicy<T>(source: Observable<T>, policy: RetryPolicy): Observable<T> {
    return source.pipe(retryWhen(policy));
}