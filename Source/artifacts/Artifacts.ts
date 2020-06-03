// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IArtifacts } from './IArtifacts';
import { Artifact } from './Artifact';
import { UnknownArtifact } from './UnknownArtifact';
import { ArtifactId } from './ArtifactId';
import { UnableToResolveArtifact } from './UnableToResolveArtifact';

/**
 * Represents an implementation of {IArtifacts}
 */
export class Artifacts implements IArtifacts {
    private _associations: Map<Function, Artifact> = new Map();

    /**
     * Initializes a new instance of {Artifacts}
     * @param {Map<Function, Artifact>?} associations Known associations
     */
    constructor(associations?: Map<Function, Artifact>) {
        if (associations) {
            this._associations = associations;
        }
    }

    /** @inheritdoc */
    hasFor(type: Function): boolean {
        return this._associations.has(type);
    }

    /** @inheritdoc */
    getFor(type: Function): Artifact {
        if (!this._associations.has(type)) {
            throw new UnknownArtifact(type);
        }
        const artifact = this._associations.get(type);
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
        } else if (input && (typeof input === 'string' || input.constructor.name === 'Guid')) {
            artifact = new Artifact(input as ArtifactId, 1);
        } else {
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
}
