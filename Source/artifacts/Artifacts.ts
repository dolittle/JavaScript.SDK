// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IArtifacts } from './IArtifacts';
import { Artifact } from './Artifact';
import { UnknownArtifact } from './UnknownArtifact';

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
}



