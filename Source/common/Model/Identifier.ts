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
export abstract class Identifier<I extends ConceptAs<Guid, string>, U extends string, E extends Extras = void> implements IEquatable {
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
        if (!this.extrasEquals(other)) return false;

        return true;
    }

    /**
     * Determines whether or not this identifier can coexist with another identifier.
     * By default identifiers with a similar id cannot coexist, but subtypes can implement custom logic.
     * @param {AnyIdentifier} identifier - The other identifier to check if can coexist with.
     * @returns {boolean} True if this identifier can coexist with the other identifier, false if not.
     */
    canCoexistWith(identifier: AnyIdentifier): boolean {
        return false;
    }

    /** @inheritdoc */
    toString(): string {
        return `${this[Symbol.toStringTag]}(${this.id.value.toString()}${this.createExtraToString()})`;
    }

    /** @inheritdoc */
    protected abstract [Symbol.toStringTag]: string;

    /**
     * Selects properties from the extra data to include while computing {@link Identifier.toString}.
     * @param {Extras} extras - The extra data of the identifier.
     * @returns {object | undefined} An object with the properties to include, or undefined.
     */
    protected toStringExtras(extras: E): object | undefined | void {
        return extras;
    }

    private createExtraToString(): string {
        if (this.__extras === undefined) return '';

        const extraToStringData = this.toStringExtras(this.__extras);
        if (extraToStringData === undefined) return '';

        let extrasToString = '';
        for (const [property, value] of Object.entries(extraToStringData)) {
            extrasToString += `, ${property}: ${value}`;
        }
        return extrasToString;
    }

    private extrasEquals(other: any): boolean {
        const { __extras: thisExtras } = this;
        const { __extras: otherExtras } = other;

        if (thisExtras === undefined || otherExtras === undefined) return thisExtras === otherExtras;
        if (typeof thisExtras !== 'object' || thisExtras === null) return false;
        if (typeof otherExtras !== 'object' || otherExtras === null) return false;

        for (const [property, value] of Object.entries(thisExtras)) {
            if (typeof value.equals !== 'function' || value.equals.length !== 1) return false;
            if (!value.equals(otherExtras[property])) return false;
        }
        for (const [property, value] of Object.entries(otherExtras) as [string, any][]) {
            if (typeof value.equals !== 'function' || value.equals.length !== 1) return false;
            if (!value.equals(thisExtras[property])) return false;
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

        const { type, id, __extras, equals, toString } = object;
        if (!isId(id)) return false;
        if (typeof type !== 'string' || type !== identifierType) return false;
        if (isExtras !== undefined) {
            for (const [property, isExtraProperty] of Object.entries(isExtras)) {
                if (!(isExtraProperty as (object: any) => boolean)(__extras[property])) return false;
            }
        }
        if (typeof equals !== 'function' || equals.length !== 1) return false;
        if (typeof toString !== 'function' || toString.length !== 0) return false;

        if (typeof object[Symbol.toStringTag] !== 'string') return false;

        return true;
    };
};
