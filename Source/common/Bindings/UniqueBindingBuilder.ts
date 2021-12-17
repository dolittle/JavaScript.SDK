// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IClientBuildResults } from '..';
import { Binding } from './Binding';
import { ICanBuildUniqueBindings } from './ICanBuildUniqueBindings';

type Equatable<T> = { equals: (other: T) => boolean; };

type Counted<T> = T & { count: number };

type GroupedSets<U, V> = [U, V[]][];

function findSet<U,V>(groupedSets: GroupedSets<U, V>, predicate: (key: U) => boolean): V[] | undefined {
    const found = groupedSets.find(([key]) => predicate(key));
    if (found !== undefined) {
        return found[1];
    }
}

type MessageCallback<U, V> = (key: U, value: V, count: number) => string;
type FailureCallback<U, V> = (key: U, values: V[]) => string | { message: string, fix?: string };
type ValueComparator<T> = (left: T, right: T) => boolean;

/**
 * Represents an implementation of {@link ICanBuildUniqueBindings}.
 * @template TIdentifier The type of the identifier.
 * @template TValue The type of the value.
 */
export class UniqueBindingBuilder<TIdentifier extends Equatable<TIdentifier>, TValue> extends ICanBuildUniqueBindings<TIdentifier, TValue> {
    private readonly _bindings: Binding<TIdentifier, TValue>[] = [];

    /**
     * Initialises a new instance of the {@link UniqueBindingBuilder} class.
     * @param {MessageCallback<TIdentifier, TValue>} _duplicateCallback - Callback to format build result message for duplicate bindings.
     * @param {FailureCallback<TIdentifier, TValue>} _conflictingIdentifierCallback - Callback to format build result failures for conflicting identifier bindings.
     * @param {FailureCallback<TValue, TIdentifier>} _conflictingValueCallback - Callback to format build result failures for conflicting value bindings.
     * @param {ValueComparator<TValue>} [_valueComparator] - An optional value comparator to use.
     */
    constructor(
        private readonly _duplicateCallback: MessageCallback<TIdentifier, TValue>,
        private readonly _conflictingIdentifierCallback: FailureCallback<TIdentifier, TValue>,
        private readonly _conflictingValueCallback: FailureCallback<TValue, TIdentifier>,
        private readonly _valueComparator: ValueComparator<TValue> = Object.is
    ) {
        super();
    }

    /** @inheritdoc */
    add(identifier: TIdentifier, value: TValue): void {
        this._bindings.push({ identifier, value });
    }

    /** @inheritdoc */
    buildUnique(results: IClientBuildResults): Binding<TIdentifier, TValue>[] {
        const counted = this.countIdentical(this._bindings);
        this.logDuplicateBindings(results, counted);

        const [byIdentifier, byValue] = this.groupByIdentifierAndValue(counted);
        const [uniqueIdentifiers, conflictingIdentifiers] = this.splitUniqueAndConflicting(byIdentifier);
        const [uniqueValues, conflictingValues] = this.splitUniqueAndConflicting(byValue);

        this.logConflictingBindings(results, conflictingIdentifiers, this._conflictingIdentifierCallback);
        this.logConflictingBindings(results, conflictingValues, this._conflictingValueCallback);

        const uniqueBindings: Binding<TIdentifier, TValue>[] = [];
        for (const [identifier, value] of uniqueIdentifiers) {
            if (uniqueValues.has(value)) {
                uniqueBindings.push({ identifier, value });
            }
        }

        return uniqueBindings;
    }

    private logDuplicateBindings(results: IClientBuildResults, bindings: readonly Counted<Binding<TIdentifier, TValue>>[]) {
        for (const { identifier, value, count } of bindings) {
            if (count > 1) {
                results.addInformation(this._duplicateCallback(identifier, value, count));
            }
        }
    }

    private logConflictingBindings<U, V>(results: IClientBuildResults, conflictingBindings: Map<U, V[]>, callback: FailureCallback<U, V>) {
        for (const [key, values] of conflictingBindings) {
            const failure = callback(key, values);
            if (typeof failure === 'string') {
                results.addFailure(failure);
            } else {
                results.addFailure(failure.message, failure.fix);
            }
        }
    }

    private countIdentical(bindings: readonly Binding<TIdentifier, TValue>[]): readonly Counted<Binding<TIdentifier, TValue>>[] {
        const countedBindings: Counted<Binding<TIdentifier, TValue>>[] = [];

        counting: for (const binding of bindings) {
            for (const counted of countedBindings) {
                if (counted.identifier.equals(binding.identifier) && this._valueComparator(counted.value, binding.value)) {
                    counted.count += 1;
                    continue counting;
                }
            }

            countedBindings.push({ ...binding, count: 1 });
        }

        return countedBindings;
    }

    private groupByIdentifierAndValue(bindings: readonly Binding<TIdentifier, TValue>[]): [Map<TIdentifier, TValue[]>, Map<TValue, TIdentifier[]>] {
        const byIdentifier: GroupedSets<TIdentifier, TValue> = [];
        const byValue: GroupedSets<TValue, TIdentifier> = [];

        for (const { identifier, value } of bindings) {

            const valuesByIdentifier = findSet(byIdentifier, _ => _.equals(identifier));
            if (valuesByIdentifier === undefined) {
                byIdentifier.push([identifier, [value]]);
            } else {
                valuesByIdentifier.push(value);
            }

            const identifiersByValue = findSet(byValue, _ => this._valueComparator(_, value));
            if (identifiersByValue === undefined) {
                byValue.push([value, [identifier]]);
            } else {
                identifiersByValue.push(identifier);
            }
        }

        return [new Map(byIdentifier), new Map(byValue)];
    }

    private splitUniqueAndConflicting<U, V>(map: Map<U, V[]>): [Map<U, V>, Map<U, V[]>] {
        const unique = new Map<U, V>();
        const conflicting = new Map<U, V[]>();
        for (const [key, values] of map) {
            if (values.length === 1) {
                unique.set(key, values[0]);
            } else {
                conflicting.set(key, values);
            }
        }
        return [unique, conflicting];
    }
}
