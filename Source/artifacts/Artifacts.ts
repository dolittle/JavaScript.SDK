// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ConceptAs } from '@dolittle/concepts';
import { Guid } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

import { Artifact, isArtifact } from './Artifact';
import { ArtifactNotAssociatedToAType } from './ArtifactNotAssociatedToAType';
import { ArtifactTypeMap } from './ArtifactTypeMap';
import { CannotHaveMultipleArtifactsAssociatedWithType } from './CannotHaveMultipleArtifactsAssociatedWithType';
import { CannotHaveMultipleTypesAssociatedWithArtifact } from './CannotHaveMultipleTypesAssociatedWithArtifact';
import { IArtifacts, ArtifactOrId } from './IArtifacts';
import { TypeNotAssociatedToArtifact } from './TypeNotAssociatedToArtifact';
import { UnableToResolveArtifact } from './UnableToResolveArtifact';

/**
 * Represents an implementation of {@link IArtifacts}.
 * @template TArtifact The artifact type to map to a type.
 * @template TId The id type of the artifact.
 */
export abstract class Artifacts<TArtifact extends Artifact<TId>, TId extends ConceptAs<Guid, string>> extends IArtifacts<TArtifact, TId> {
    /**
     * Initialises a new instance of the {@link Artifacts} class.
     * @param {ArtifactTypeMap<TArtifact, TId, Constructor<any>>} _associations - The associations map to use.
     */
    constructor(private readonly _associations: ArtifactTypeMap<TArtifact, TId, Constructor<any>>) {
        super();
    }

    /** @inheritdoc */
    getAll() {
        return Array.from(this._associations.keys());
    }

    /** @inheritdoc */
    hasTypeFor(input: TArtifact): boolean {
        return this._associations.has(input);
    }

    /** @inheritdoc */
    getTypeFor(input: TArtifact): Constructor<any> {
        const type = this._associations.get(input);
        if (!type) {
            throw new ArtifactNotAssociatedToAType(input);
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
    getFor(type: Constructor<any>): TArtifact {
        for (const [associatedArtifact, associatedType] of this._associations) {
            if (associatedType === type) {
                return associatedArtifact;
            }
        }

        throw new TypeNotAssociatedToArtifact(this.artifactTypeName, type);
    }

    /** @inheritdoc */
    resolveFrom(object: any, artifactOrArtifactId?: ArtifactOrId<TArtifact, TId>): TArtifact {
        if (isArtifact(artifactOrArtifactId)) {
            return artifactOrArtifactId;
        } else if (artifactOrArtifactId !== undefined) {
            return this.createArtifact(artifactOrArtifactId);
        } else if (object && this.hasFor(Object.getPrototypeOf(object).constructor)) {
            return this.getFor(Object.getPrototypeOf(object).constructor);
        }

        throw new UnableToResolveArtifact(this.artifactTypeName, object);
    }

    /** @inheritdoc */
    associate(type: Constructor<any>, artifact: TArtifact): void {
        this.throwIfMultipleArtifactsAssociatedWithType(type, artifact);
        this.throwIfMultipleTypesAssociatedWithArtifact(artifact, type);
        this._associations.set(artifact, type);
    }

    protected abstract readonly artifactTypeName: string;

    protected abstract createArtifact(id: TId | Guid | string): TArtifact;

    private throwIfMultipleArtifactsAssociatedWithType(type: Constructor<any>, artifact: TArtifact) {
        if (this.hasFor(type)) {
            throw new CannotHaveMultipleArtifactsAssociatedWithType(type, artifact, this.getFor(type));
        }
    }

    private throwIfMultipleTypesAssociatedWithArtifact(artifact: TArtifact, type: Constructor<any>) {
        if (this.hasTypeFor(artifact)) {
            throw new CannotHaveMultipleTypesAssociatedWithArtifact(artifact, type, this.getTypeFor(artifact));
        }
    }
}
