// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

import { IClientBuildResults } from '../ClientSetup/IClientBuildResults';
import { CannotUnbindIdentifierFromProcessorBuilderThatIsNotBound } from './CannotUnbindIdentifierFromProcessorBuilderThatIsNotBound';
import { CannotUnbindIdentifierFromTypeThatIsNotBound } from './CannotUnbindIdentifierFromTypeThatIsNotBound';

import { AnyIdentifier } from './Identifier';
import { IModel } from './IModel';
import { IModelBuilder } from './IModelBuilder';
import { Model } from './Model';
import { ProcessorBuilder } from './ProcessorBuilder';

type IdentifierMap<V> = Map<string, [AnyIdentifier, V][]>;

/**
 * Represents an implementation of {@link IModelBuilder}.
 */
export class ModelBuilder extends IModelBuilder {
    private readonly _typesByIdentifier: IdentifierMap<Constructor<any>> = new Map();
    private readonly _processorBuildersByIdentifier: IdentifierMap<ProcessorBuilder> = new Map();

    /** @inheritdoc */
    bindIdentifierToType(identifier: AnyIdentifier, type: Constructor<any>): void {
        const types = this.getMapList(this._typesByIdentifier, identifier);
        types.push([identifier, type]);
    }

    /** @inheritdoc */
    unbindIdentifierFromType(identifier: AnyIdentifier, type: Constructor<any>): void {
        const types = this.getMapList(this._typesByIdentifier, identifier);
        const foundIndex = this.findListIndex(types, identifier, type);
        if (foundIndex < 0) {
            throw new CannotUnbindIdentifierFromTypeThatIsNotBound(identifier, type);
        }
        types.splice(foundIndex, 1);
    }

    /** @inheritdoc */
    bindIdentifierToProcessorBuilder(identifier: AnyIdentifier, processorBuilder: ProcessorBuilder): void {
        const processorBuilders = this.getMapList(this._processorBuildersByIdentifier, identifier);
        processorBuilders.push([identifier, processorBuilder]);
    }

    /** @inheritdoc */
    unbindIdentifierFromProcessorBuilder(identifier: AnyIdentifier, processorBuilder: ProcessorBuilder): void {
        const processorBuilders = this.getMapList(this._processorBuildersByIdentifier, identifier);
        const foundIndex = this.findListIndex(processorBuilders, identifier, processorBuilder);
        if (foundIndex < 0) {
            throw new CannotUnbindIdentifierFromProcessorBuilderThatIsNotBound(identifier, processorBuilder);
        }
        processorBuilders.splice(foundIndex, 1);
    }

    /** @inheritdoc */
    build(buildResults: IClientBuildResults): IModel {
        const deduplicatedTypes = this.deduplicateBindings(
            this._typesByIdentifier,
            (left, right) => left === right,
            (identifier, type, duplicates) => {
                buildResults.addInformation(`Type binding from ${identifier.constructor.name} to ${type.name} appeared ${duplicates} time`);
            });
        const deduplicatedProcessorBuilders = this.deduplicateBindings(
            this._processorBuildersByIdentifier,
            (left, right) => left.equals(right),
            (identifier, processorBuilder, duplicates) => {
                buildResults.addInformation(`Processor binding from ${identifier.constructor.name} to ${processorBuilder.constructor.name} appeared ${duplicates} time`);
            });

        const validTypeBindings: [AnyIdentifier, Constructor<any>][] = [];
        const validProcessorBuilderBindings: [AnyIdentifier, ProcessorBuilder][] = [];

        const ids = Array.from(new Set([...deduplicatedTypes.keys(), ...deduplicatedProcessorBuilders.keys()]));
        for (const id of ids) {
            const [coexistentTypes, conflictingTypes] = this.splitCoexistingAndConflictingBindings(
                deduplicatedTypes,
                id,
                (left, right) => left === right);
            const [coexistentProcessorBuilders, conflictingProcessorBuilders] = this.splitCoexistingAndConflictingBindings(
                deduplicatedProcessorBuilders,
                id,
                (left, right) => left.equals(right));

            if (conflictingTypes.length === 0 && conflictingProcessorBuilders.length === 0) {
                validTypeBindings.push(...coexistentTypes);
                validProcessorBuilderBindings.push(...coexistentProcessorBuilders);
                continue;
            }

            const conflicts = [];
            if (conflictingTypes.length > 0) conflicts.push('types');
            if (conflictingProcessorBuilders.length > 0) conflicts.push('processors');
            buildResults.addFailure(`The identifier ${id} was bound to conflicting ${conflicts.join(' and ')}:`);
            for (const [identifier, type] of conflictingTypes) {
                buildResults.addFailure(`\t ${identifier} was bound to ${type.name}. This binding will be ignored`);
            }
            for (const [identifier, processorBuilder] of conflictingProcessorBuilders) {
                buildResults.addFailure(`\t ${identifier} was bound to ${processorBuilder.constructor.name}. This binding will be ignored`);
            }

            if (coexistentTypes.length > 0 || coexistentProcessorBuilders.length > 0) {
                buildResults.addFailure(`The identifier ${id} was also bound to:`);
            }
            for (const [identifier, type] of coexistentTypes) {
                buildResults.addFailure(`\t ${identifier} binding to ${type.name}. This binding will be ignored`);
            }
            for (const [identifier, processorBuilder] of coexistentProcessorBuilders) {
                buildResults.addFailure(`\t ${identifier} binding to ${processorBuilder.constructor.name}. This binding will be ignored`);
            }
        }

        for (const [identifier, type] of validTypeBindings) {
            buildResults.addInformation(`${identifier} will be bound to type ${type.name}`);
        }
        for (const [identifier, processorBuilder] of validProcessorBuilderBindings) {
            buildResults.addInformation(`${identifier} will be bound to processor builder ${processorBuilder.constructor.name}`);
        }

        return new Model(validTypeBindings, validProcessorBuilderBindings);
    }

    private getMapList<V>(map: IdentifierMap<V>, identifier: AnyIdentifier): [AnyIdentifier, V][] {
        const key = identifier.id.value.toString();
        if (!map.has(key)) {
            const list: [AnyIdentifier, V][] = [];
            map.set(key, list);
            return list;
        } else {
            return map.get(key)!;
        }
    };

    private findListIndex<V>(list: [AnyIdentifier, V][], identifier: AnyIdentifier, value: V): number {
        return list.findIndex(([existingIdentifier, existingValue]) => {
            return existingIdentifier.equals(identifier) && existingValue === value;
        });
    };

    private deduplicateBindings<V>(map: IdentifierMap<V>, comparer: (left: V, right: V) => boolean, callback: (identifier: AnyIdentifier, value: V, duplicates: number) => void): IdentifierMap<V> {
        const filteredMap: IdentifierMap<V> = new Map();

        for (const [key, bindings] of map.entries()) {
            const countedBindings: [AnyIdentifier, V, number][] = [];
            counting: for (const [identifier, value] of bindings) {
                for (const existing of countedBindings) {
                    const [existingIdentifier, existingValue, duplicates] = existing;

                    if (existingIdentifier.equals(identifier) && comparer(existingValue, value)) {
                        existing[2] = duplicates + 1;
                        continue counting;
                    }
                }

                countedBindings.push([identifier, value, 1]);
            }

            const filteredBindings: [AnyIdentifier, V][] = [];
            for (const [identifier, value, duplicates] of countedBindings) {
                if (duplicates > 1) {
                    callback(identifier, value, duplicates);
                }
                filteredBindings.push([identifier, value]);
            }

            filteredMap.set(key, filteredBindings);
        }

        return filteredMap;
    }

    private splitCoexistingAndConflictingBindings<V>(map: IdentifierMap<V>, key: string, comparer: (left: V, right: V) => boolean): [[AnyIdentifier, V][], [AnyIdentifier, V][]] {
        if (!map.has(key)) return [[], []];

        const bindings = map.get(key)!;
        const conflicts = new Set<AnyIdentifier>();

        for (const [identifier, value] of bindings) {
            for (const [otherIdentifier, otherValue] of bindings) {
                const canCoexist =
                    (identifier.equals(otherIdentifier) && comparer(value, otherValue)) ||
                    (identifier.canCoexistWith(otherIdentifier) && !comparer(value, otherValue));

                if (!canCoexist) {
                    conflicts.add(identifier);
                    conflicts.add(otherIdentifier);
                }
            }
        }

        const coexisting: [AnyIdentifier, V][] = [];
        const conflicting: [AnyIdentifier, V][] = [];

        for (const [identifier, value] of bindings) {
            if (conflicts.has(identifier)) {
                conflicting.push([identifier, value]);
            } else {
                coexisting.push([identifier, value]);
            }
        }

        return [coexisting, conflicting];
    }
}
