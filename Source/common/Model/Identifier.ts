// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ConceptAs } from '@dolittle/concepts';
import { Guid, IEquatable } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

/* eslint-disable @typescript-eslint/naming-convention */

type Extras = { [property: string]: IEquatable } | void;

type ExtraPredicates<E extends Extras> = E extends void
    ? undefined
    : { [property in keyof E]: (object: any) => object is E[property] };

/**
 * Defines an identifier in an application model.
 * @template I The type of the globally unique id of the identifier.
 * @template E The type of the extra data of the identifier.
 */
export class Identifier<I extends ConceptAs<Guid, string>, U extends string, E extends Extras = void> implements IEquatable {
    /**
     * Initialises a new instance of the {@link Identifier} class.
     * @param {I} id - The globally unique id for the identifier.
     * @param {string} type - The unique name of the identifier.
     * @param {E} __extras - The extra data for the identifier.
     */
    constructor(
        readonly id: I,
        readonly type: U,
        readonly __extras: E
    ) {
    }

    /** @inheritdoc */
    equals(other: any): boolean {
        if (typeof other !== 'object' || other === null) return false;
        if (this.type !== other.type) return false;
        if (!this.id.equals(other.id)) return false;
        if (typeof this.__extras === 'object') {
            for (const [property, value] of Object.entries(this.__extras)) {
                if (!value.equals(other.__extras[property])) return false;
            }
        }

        return true;
    }
}

/**
 * Represents any kind of {@link Identifier}.
 */
export type AnyIdentifier = Identifier<ConceptAs<Guid, string>, string, Extras>;

type CreateIsIdentifier = {
    /**
     * Creates a type predicate for the provided {@link Identifier} type.
     * @param {Constructor} type - The type of the identifier.
     * @param {(any) => boolean} isId - The predicate for the globally unqiue id of the identifier.
     * @param {string} identifierType - The unique name of the identifier.
     * @returns {(any) => boolean} A type predicate that checksi if an object is an instance of the {@link Identifier} type.
     */
    <T extends Identifier<I, U, E>, I extends ConceptAs<Guid, string>, U extends string, E extends void>(
        type: Constructor<T>,
        isId: (object: any) => object is T['id'],
        identifierType: T['type']
    ): (object: any) => object is T ;

    /**
     * Creates a type predicate for the provided {@link Identifier} type.
     * @param {Constructor} type - The type of the identifier.
     * @param {(any) => boolean} isId - The predicate for the globally unqiue id of the identifier.
     * @param {string} identifierType - The unique name of the identifier.
     * @param {any} isExtras - Predicates used to check the extra data of the identifier.
     * @returns {(any) => boolean} A type predicate that checksi if an object is an instance of the {@link Identifier} type.
     */
    <T extends Identifier<I, U, E>, I extends ConceptAs<Guid, string>, U extends string, E extends Extras>(
        type: Constructor<T>,
        isId: (object: any) => object is T['id'],
        identifierType: T['type'],
        isExtras: ExtraPredicates<T['__extras']>
    ): (object: any) => object is T ;
};

export const createIsIdentifier: CreateIsIdentifier = <T extends Identifier<I, U, E>, I extends ConceptAs<Guid, string>, U extends string, E extends Extras>(
    type: Constructor<T>,
    isId: (object: any) => object is T['id'],
    identifierType: T['type'],
    isExtras?: ExtraPredicates<T['__extras']>
): (object: any) => object is T => {
    return (object): object is T => {
        if (typeof object !== 'object' || object === null) return false;

        const { type, id, __extras, equals } = object;
        if (!isId(id)) return false;
        if (typeof type !== 'string' || type !== identifierType) return false;
        if (isExtras !== undefined) {
            for (const [property, isExtraProperty] of Object.entries(isExtras)) {
                if (!(isExtraProperty as (object: any) => boolean)(__extras[property])) return false;
            }
        }
        if (typeof equals !== 'function' || equals.length !== 1) return false;

        return true;
    };
};
