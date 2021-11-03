// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Exception } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';
import { Artifact, ArtifactIdLike } from './Artifact';
import { ArtifactTypeMap } from './ArtifactTypeMap';
import { IArtifacts, ArtifactOrId } from './IArtifacts';

/**
 * Represents an implementation of {@link IEventTypes}
 */
export abstract class Artifacts<TArtifact extends Artifact<TId>, TId extends ArtifactIdLike> extends IArtifacts<TArtifact, TId> {
    /**
     * Initializes a new instance of {@link EventTypes}
     * @param {EventTypeMap<Constructor<any>>} [associations] Known associations
     */
    constructor(private _associations: ArtifactTypeMap<TArtifact, TId, Constructor<any>>) {
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
            throw this.createNoTypeAssociatedWithArtifact(input);
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
        let artifact: TArtifact | undefined;
        for (const [associatedEventType, associatedType] of this._associations) {
            if (associatedType === type) {
                artifact = associatedEventType;
            }
        }
        if (!artifact) {
            throw this.createNoArtifactAssociatedWithType(type);
        }
        return artifact;
    }
    /** @inheritdoc */
    resolveFrom(object: any, artifactOrArtifactId?: ArtifactOrId<TArtifact, TId>): TArtifact {
        let artifact: TArtifact | undefined;
        if (artifactOrArtifactId !== undefined) {
            artifact = this.createArtifact(artifactOrArtifactId);
        } else if (object && this.hasFor(Object.getPrototypeOf(object).constructor)) {
            artifact = this.getFor(Object.getPrototypeOf(object).constructor);
        }

        if (!artifact) {
            throw this.createUnableToResolveArtifact(object);
        }

        return artifact;
    }

    /** @inheritdoc */
    associate(type: Constructor<any>, artifact: TArtifact): void {
        this.throwIfMultipleTypesAssociatedWithArtifact(artifact, type);
        this.throwIfMultipleArtifactsAssociatedWithType(type, artifact);
        this._associations.set(artifact, type);
    }

    private artifactsEquals(left: TArtifact, right: TArtifact): boolean {
        return left.generation.equals(right.generation)
            && left.id.toString() === right.id.toString();
    }

    protected abstract createArtifact (artifactOrId: ArtifactOrId<TArtifact, TId>): TArtifact;
    protected abstract createNoArtifactAssociatedWithType (type: Constructor<any>): Exception;
    protected abstract createNoTypeAssociatedWithArtifact (artifact: TArtifact): Exception;
    protected abstract createUnableToResolveArtifact (object: any): Exception;
    protected abstract createCannotAssociateMultipleArtifactsWithType (type: Constructor<any>, artifact: TArtifact, existing: TArtifact): Exception;
    protected abstract createCannotAssociateMultipleTypesWithArtifact (artifact: TArtifact, type: Constructor<any>, existing: Constructor<any>): Exception;

    private throwIfMultipleArtifactsAssociatedWithType(type: Constructor<any>, artifact: TArtifact) {
        if (this.hasFor(type)) {
            throw this.createCannotAssociateMultipleArtifactsWithType(type, artifact, this.getFor(type));
        }
    }

    private throwIfMultipleTypesAssociatedWithArtifact(artifact: TArtifact, type: Constructor<any>) {
        if (this.hasTypeFor(artifact)) {
            throw this.createCannotAssociateMultipleTypesWithArtifact(artifact, type, this.getTypeFor(artifact));
        }
    }

}
