// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ArtifactId } from './ArtifactId';

export class Artifact {
    readonly id!: ArtifactId;
    readonly generation!: number;
}
