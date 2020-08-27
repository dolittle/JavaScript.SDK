// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { Guid } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';
import {
    IArtifacts,
    ArtifactAssociation,
    Artifact,
    ArtifactsFromDecorators,
    ArtifactId,
    UnknownType,
    UnableToResolveArtifact,
    UnknownArtifact,
    Generation
} from './index';

/**
 * Represents an implementation of {IArtifacts}
 */
export class Artifacts implements IArtifacts {
    private _registered: ReplaySubject<ArtifactAssociation>;
    private _associations: BehaviorSubject<Map<Constructor<any>, Artifact>>;

    /**
     * Initializes a new instance of {@link Artifacts}
     * @param {Map<Function, Artifact>?} associations Known associations
     */
    constructor(associations?: Map<Constructor<any>, Artifact>) {
        this._associations = new BehaviorSubject(new Map());
        this._registered = new ReplaySubject();

        if (associations) {
            for (const [key, value] of associations.entries()) {
                this._registered.next(new ArtifactAssociation(key, value));
            }
        }

        this._registered.subscribe(association => this.addAssociation(association));
        ArtifactsFromDecorators.artifacts.subscribe(association => this.addAssociation(association));
    }

    /** @inheritdoc */
    hasTypeFor(input: Artifact | ArtifactId): boolean {
        if (!(input instanceof Artifact)) {
            input = new Artifact(input);
        }

        for (const artifact of this._associations.value.values()) {
            if (this.artifactEquals(artifact, input)) {
                return true;
            }
        }

        return false;
    }

    /** @inheritdoc */
    getTypeFor(input: Artifact | ArtifactId): Constructor<any> {
        if (!(input instanceof Artifact)) {
            input = new Artifact(input);
        }

        for (const [type, artifact] of this._associations.value.entries()) {
            if (this.artifactEquals(artifact, input)) {
                return type;
            }
        }

        throw new UnknownType(input);
    }


    /** @inheritdoc */
    hasFor(type: Constructor<any>): boolean {
        return this._associations.value.has(type);
    }

    /** @inheritdoc */
    getFor(type: Constructor<any>): Artifact {
        if (!this._associations.value.has(type)) {
            throw new UnknownArtifact(type);
        }
        const artifact = this._associations.value.get(type);
        if (!artifact) {
            throw new UnknownArtifact(type);
        }
        return artifact;
    }

    /** @inheritdoc */
    resolveFrom(object: any, input?: Artifact | ArtifactId | string): Artifact {
        let artifact: Artifact | undefined;

        if (input != null) {
            if (input instanceof Artifact) artifact = input;
            else if (typeof input === 'string') artifact = new Artifact(ArtifactId.create(input));
            else artifact = new Artifact(input);
        } else if (object && this.hasFor(object.constructor)) {
            artifact = this.getFor(object.constructor);
        }

        if (!artifact) {
            throw new UnableToResolveArtifact(object, input);
        }

        return artifact;
    }

    /** @inheritdoc */
    associate(type: Constructor<any>, identifier: ArtifactId, generation = Generation.first): void {
        this._registered.next(new ArtifactAssociation(type, new Artifact(identifier, generation)));
    }

    private addAssociation(association: ArtifactAssociation) {
        const map = new Map(this._associations.value);
        map.set(association.type, association.artifact);
        this._associations.next(map);
    }

    private artifactEquals(left: Artifact, right: Artifact): boolean {
        return left.generation === right.generation && left.id.toString() === right.id.toString();
    }
}
