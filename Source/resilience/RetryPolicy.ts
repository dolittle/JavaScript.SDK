// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Observable, concat, throwError } from 'rxjs';
import { retryWhen, takeUntil, endWith } from 'rxjs/operators';

import { Cancellation } from './Cancellation';
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

export function retryWithPolicy<T>(source: Observable<T>, policy: RetryPolicy, cancellation: Cancellation): Observable<T> {
    return source.pipe(retryWhen((errors: Observable<Error>) => {
        const cancelled = cancellation.pipe(endWith(true));
        const retriesUntilCancelled = policy(errors).pipe(takeUntil(cancelled));
        const retriesThenError = concat(retriesUntilCancelled, throwError(new Error('Retry was cancelled')));
        return retriesThenError;
    }));
}