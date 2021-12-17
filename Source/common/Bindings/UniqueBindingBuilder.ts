// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IEquatable } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

import { IClientBuildResults } from '../ClientSetup/IClientBuildResults';
import { Binding } from './Binding';
import { ICanBuildUniqueBindings } from './ICanBuildUniqueBindings';

type Counted<T> = T & { count: number };

type GroupedSets<U, V> = [U, V[]][];

function findSet<U,V>(groupedSets: GroupedSets<U, V>, predicate: (key: U) => boolean): V[] | undefined {
    const found = groupedSets.find(([key]) => predicate(key));
    if (found !== undefined) {
        return found[1];
    }
}

type ValueStringer<T> = (value: T) => string;
type ValueComparator<T> = (left: T, right: T) => boolean;

/**
 * Represents an implementation of {@link ICanBuildUniqueBindings}.
 * @template TIdentifier The type of the identifiers.
 * @template TValue The type of the values.
 */
export class UniqueBindingBuilder<TIdentifier extends IEquatable, TValue> extends ICanBuildUniqueBindings<TIdentifier, TValue> {
    private readonly _bindings: Binding<TIdentifier, TValue>[] = [];

    /**
     * Initialises a new instance of the {@link UniqueBindingBuilder} class.
     * @param {string} _kind - A string that describes the kind to bind.
     * @param {ValueStringer<TValue>} [_valueStringer] - An optional callback to use to convert the value to a string.
     * @param {ValueComparator<TValue>} [_valueComparator] - An optional value comparator to use.
     */
    constructor(
        private readonly _kind: string,
        private readonly _valueStringer: ValueStringer<TValue> = (value) => `${value}`,
        private readonly _valueComparator: ValueComparator<TValue> = Object.is,
    ) {
        super();
    }

    /** @inheritdoc */
    add(identifier: TIdentifier, type: Constructor<any>, value: TValue): void {
        this._bindings.push({ identifier, type, value });
    }

    /** @inheritdoc */
    buildUnique(results: IClientBuildResults): readonly Binding<TIdentifier, TValue>[] {
        const counted = this.countIdentical(this._bindings);

        const [byIdentifier, byType] = this.groupByIdentifierAndType(counted);
        const [uniqueIdentifiers, conflictingIdentifiers] = this.splitUniqueAndConflicting(byIdentifier);
        const [uniqueTypes, conflictingTypes] = this.splitUniqueAndConflicting(byType);

        const uniqueBindings: Binding<TIdentifier, TValue>[] = [];
        for (const [identifier, [type, value]] of uniqueIdentifiers) {
            if (uniqueTypes.has(type)) {
                uniqueBindings.push({ identifier, type, value });
            }
        }

        this.logDuplicateBindings(results, counted);
        this.logConflictingIdentifiers(results, conflictingIdentifiers);
        this.logConflictingTypes(results, conflictingTypes);

        return uniqueBindings;
    }

    private countIdentical(bindings: readonly Binding<TIdentifier, TValue>[]): readonly Counted<Binding<TIdentifier, TValue>>[] {
        const countedBindings: Counted<Binding<TIdentifier, TValue>>[] = [];

        counting: for (const binding of bindings) {
            for (const counted of countedBindings) {
                if (counted.identifier.equals(binding.identifier)
                    && counted.type === binding.type
                    && this._valueComparator(counted.value, binding.value)
                ) {
                    counted.count += 1;
                    continue counting;
                }
            }

            countedBindings.push({ ...binding, count: 1 });
        }

        return countedBindings;
    }

    private groupByIdentifierAndType(bindings: readonly Binding<TIdentifier, TValue>[]): [Map<TIdentifier, [Constructor<any>, TValue][]>, Map<Constructor<any>, [TIdentifier, TValue][]>] {
        const byIdentifier: GroupedSets<TIdentifier, [Constructor<any>, TValue]> = [];
        const byType: GroupedSets<Constructor<any>, [TIdentifier, TValue]> = [];

        for (const { identifier, type, value } of bindings) {

            const typesByIdentifier = findSet(byIdentifier, _ => _.equals(identifier));
            if (typesByIdentifier === undefined) {
                byIdentifier.push([identifier, [[type, value]]]);
            } else {
                typesByIdentifier.push([type, value]);
            }

            const identifiersByType = findSet(byType, _ => Object.is(_, type));
            if (identifiersByType === undefined) {
                byType.push([type, [[identifier, value]]]);
            } else {
                identifiersByType.push([identifier, value]);
            }
        }

        return [new Map(byIdentifier), new Map(byType)];
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

    private logDuplicateBindings(results: IClientBuildResults, bindings: readonly Counted<Binding<TIdentifier, TValue>>[]) {
        for (const { identifier, type, value, count } of bindings) {
            if (count > 1) {
                results.addInformation(`The ${this._kind} id ${identifier} was bound to ${type.name} with ${this._valueStringer(value)} ${count} times`);
            }
        }
    }

    private logConflictingIdentifiers(results: IClientBuildResults, conflictingIdentifiers: Map<TIdentifier, [Constructor<any>, TValue][]>) {
        for (const [identifier, values] of conflictingIdentifiers) {
            results.addFailure(`The ${this._kind} id ${identifier} was bound to multiple ${this._kind}s. None of these will be bound`);

            for (const [type, value] of values) {
                results.addFailure(`\t${identifier} was bound to ${type.name} with ${this._valueStringer(value)}`);
            }
        }
    }

    private logConflictingTypes(results: IClientBuildResults, conflictingTypes: Map<Constructor<any>, [TIdentifier, TValue][]>) {
        for (const [type, values] of conflictingTypes) {
            results.addFailure(`The ${this._kind} ${type.name} was bound to multiple ${this._kind} ids. None of these will be bound`);

            for (const [identifier, value] of values) {
                results.addFailure(`\t${type.name} was bound to ${identifier} with ${this._valueStringer(value)}`);
            }
        }
    }
}
