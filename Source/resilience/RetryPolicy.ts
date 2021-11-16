// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Observable, concat, throwError } from 'rxjs';
import { retryWhen, takeUntil, endWith } from 'rxjs/operators';

import { Cancellation } from './Cancellation';
import { RetryOperator } from './RetryOperator';

/**
 * Defines a retry policy for observables by passing along the errors that should result in a re-subscription of the original observable.
 */
export type RetryPolicy = (errors: Observable<Error>) => Observable<Error>;

/**
 * Creates a retry policy from a pipe of operators.
 * @param {RetryOperator[]} operators - Operators for the pipe.
 * @returns {RetryPolicy} The {@link RetryPolicy} that consist of the combined policies.
 */
export function retryPipe(...operators: RetryOperator[]): RetryPolicy {
    return (errors: Observable<Error>) => {
        let result = errors;
        for (const operator of operators) {
            result = result.pipe(operator);
        }
        return result;
    };
}

/**
 * Run a {@link Observable<T>} with a {@link RetryPolicy}.
 * @template T Type for the observable.
 * @param {Observable<T>} source - Observable to retry for.
 * @param {RetryPolicy} policy - The policy to apply.
 * @param {Cancellation} cancellation - A cancellation.
 * @returns {Observable<T>} The {@link Observable<T>} that is automatically retried.
 */
export function retryWithPolicy<T>(source: Observable<T>, policy: RetryPolicy, cancellation: Cancellation): Observable<T> {
    return source.pipe(retryWhen((errors: Observable<Error>) => {
        const cancelled = cancellation.pipe(endWith(true));
        const retriesUntilCancelled = policy(errors).pipe(takeUntil(cancelled));
        const retriesThenError = concat(retriesUntilCancelled, throwError(new Error('Retry was cancelled')));
        return retriesThenError;
    }));
}
