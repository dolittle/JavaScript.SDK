// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ConceptAs } from '@dolittle/concepts';
import { Guid } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

import { IdentifierTypeMap } from './IdentifierTypeMap';
import { IdentifierNotAssociatedToAType } from './IdentifierNotAssociatedToAType';
import { IIdentifiers } from './IIdentifiers';
import { TypeNotAssociatedToIdentifier } from './TypeNotAssociatedToIdentifier';
import { UnableToResolveIdentifier } from './UnableToResolveIdentifier';
import { CannotHaveMultipleIdentifiersAssociatedWithType } from './CannotHaveMultipleIdentifiersAssociatedWithType';
import { CannotHaveMultipleTypesAssociatedWithIdentifier } from './CannotHaveMultipleTypesAssociatedWithIdentifier';

/**
 * Represents an implementation of {@link IIdentifiers}.
 * @template TId The type of the identifer.
 */
export abstract class Identifiers<TId extends ConceptAs<Guid, string>> extends IIdentifiers<TId> {
    /**
     * Initialises a new instance of the {@link Identifiers} class.
     * @param {IdentifierTypeMap<TId, Constructor<any>>} _associations - The associations map to use.
     */
    constructor(private readonly _associations: IdentifierTypeMap<TId, Constructor<any>>) {
        super();
    }

    /** @inheritdoc */
    getAll(): TId[] {
        return Array.from(this._associations.keys());
    }

    /** @inheritdoc */
    hasTypeFor(input: TId): boolean {
        return this._associations.has(input);
    }

    /** @inheritdoc */
    getTypeFor(input: TId): Constructor<any> {
        const type = this._associations.get(input);
        if (!type) {
            throw new IdentifierNotAssociatedToAType(input);
        }
        return type;
    }

    /** @inheritdoc */
    hasFor(type: Constructor<any>): boolean {
        for (const associatedType of this._associations.values()) {
            if (associatedType === type) {
                return true;
            }
        }
        return false;
    }

    /** @inheritdoc */
    getFor(type: Constructor<any>): TId {
        for (const [associatedIdentifier, associatedType] of this._associations) {
            if (associatedType === type) {
                return associatedIdentifier;
            }
        }

        throw new TypeNotAssociatedToIdentifier(this.identifierTypeName, type);
    }

    /** @inheritdoc */
    resolveFrom(object: any, input?: string | TId | Guid): TId {
        if (input !== undefined) {
            return this.createIdentifier(input);
        } else if (object && this.hasFor(Object.getPrototypeOf(object).constructor)) {
            return this.getFor(Object.getPrototypeOf(object).constructor);
        }

        throw new UnableToResolveIdentifier(this.identifierTypeName, object);
    }

    /** @inheritdoc */
    associate(type: Constructor<any>, identifier: TId): void {
        this.throwIfMultipleIdentifiersAssociatedWithType(type, identifier);
        this.throwIfMultipleTypesAssociatedWithIdentifier(identifier, type);
        this._associations.set(identifier, type);
    }

    protected abstract readonly identifierTypeName: string;

    protected abstract createIdentifier(id: TId | Guid | string): TId;

    private throwIfMultipleIdentifiersAssociatedWithType(type: Constructor<any>, identifier: TId) {
        if (this.hasFor(type)) {
            throw new CannotHaveMultipleIdentifiersAssociatedWithType(type, identifier, this.getFor(type));
        }
    }

    private throwIfMultipleTypesAssociatedWithIdentifier(identifier: TId, type: Constructor<any>) {
        if (this.hasTypeFor(identifier)) {
            throw new CannotHaveMultipleTypesAssociatedWithIdentifier(identifier, type, this.getTypeFor(identifier));
        }
    }
}
