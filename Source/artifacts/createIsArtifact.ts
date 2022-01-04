// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';
import { Artifact, ArtifactIdLike, isArtifact } from './Artifact';

/**
 * Creates a type predicate for the provided {@link Artifact} type.
 * @param {Constructor} type - The type of the artifact.
 * @param {(any) => boolean} idTypePredicate - A predicate to use to check the type of the artifact id.
 * @param {(any) => boolean} [extraPredicate] - An optional predicate to use to perform additional checks on the object.
 * @returns {(any) => boolean} A type predicate that checks if an object is an instance of the {@link Artifact} type.
 */
export const createIsArtifact = <A extends Artifact<T>, T extends ArtifactIdLike>(
    type: Constructor<A>,
    idTypePredicate: (object: any) => object is A['id'],
    extraPredicate?: (object: A) => boolean
): (object: any) => object is A => {
    return (object): object is A => {
        if (!isArtifact(object)) return false;
        if (!idTypePredicate(object.id)) return false;
        if (extraPredicate !== undefined && !extraPredicate(object as A)) return false;
        return true;
    };
};
