// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { IArtifacts } from './IArtifacts';
import { Artifact } from './Artifact';
import { UnknownArtifact } from './UnknownArtifact';
import { ArtifactId } from './ArtifactId';
import { UnableToResolveArtifact } from './UnableToResolveArtifact';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { ArtifactAssociation } from './ArtifactAssociation';
import { ArtifactsFromDecorators } from './ArtifactsFromDecorators';

/**
 * Represents an implementation of {IArtifacts}
 */
export class Artifacts implements IArtifacts {
    private _registered: ReplaySubject<ArtifactAssociation>;
    private _associations: BehaviorSubject<Map<Function, Artifact>>;

    /**
     * Initializes a new instance of {Artifacts}
     * @param {Map<Function, Artifact>?} associations Known associations
     */
    constructor(associations?: Map<Function, Artifact>) {
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
    hasFor(type: Function): boolean {
        return this._associations.value.has(type);
    }

    /** @inheritdoc */
    getFor(type: Function): Artifact {
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

        if (input && input instanceof Artifact) {
            artifact = input as Artifact;
        }
        else if (input && (typeof input === 'string' || input.constructor.name === 'Guid')) {
            artifact = new Artifact(input as ArtifactId, 1);
        }
        else {
            if (object) {
                if (this.hasFor(object.constructor)) {
                    artifact = this.getFor(object.constructor);
                }
            }
        }

        if (!artifact) {
            throw new UnableToResolveArtifact(object, input);
        }

        return artifact;
    }

    /** @inheritdoc */
    associate(type: Function, identifier: ArtifactId, generation = 1): void {
        this._registered.next(new ArtifactAssociation(type, new Artifact(Guid.as(identifier), generation)));
    }

    private addAssociation(association: ArtifactAssociation) {
        const map = new Map(this._associations.value);
        map.set(association.type, association.artifact);
        this._associations.next(map);
    }
}
