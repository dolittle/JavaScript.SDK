// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

type RecursiveReadModelField<T, P extends string> =
    T extends (infer U)[] ? RecursiveReadModelField<U, P> :
    T extends object ? P | `${P}.${ReadModelField<T>}` :
    P;

/**
 * Defines the fields of a read model type.
 */
export type ReadModelField<T> = ({
    [TKey in keyof T & string]:
        T[TKey] extends Function ? never :
        RecursiveReadModelField<T[TKey], `${TKey}`>;
})[ keyof T & string];
