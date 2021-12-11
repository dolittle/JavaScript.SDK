// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';

import { Artifact as SdkArtifact, ArtifactIdLike, Generation } from '@dolittle/sdk.artifacts';
import { ExecutionContext as SdkExecutionContext, Claim as SdkClaim, Version as SdkVersion } from '@dolittle/sdk.execution';

import { Failure as SdkFailure } from './Failure';

import { Artifact as PbArtifact } from '@dolittle/contracts/Artifacts/Artifact_pb';
import { ExecutionContext as PbExecutionContext } from '@dolittle/contracts/Execution/ExecutionContext_pb';
import { Failure as PbFailure } from '@dolittle/contracts/Protobuf/Failure_pb';
import { Uuid } from '@dolittle/contracts/Protobuf/Uuid_pb';
import { Claim as PbClaim } from '@dolittle/contracts/Security/Claim_pb';
import { CallRequestContext as PbCallRequestContext } from '@dolittle/contracts/Services/CallContext_pb';
import { Version as PbVersion } from '@dolittle/contracts/Versioning/Version_pb';

declare module '@dolittle/rudiments' {
    interface Guid {
        /**
         * Convert to protobuf representation.
         * @returns {Uuid} The converted UUID.
         */
        toProtobuf(): Uuid
    }
}

declare module '@dolittle/sdk.artifacts' {
    abstract class Artifact<TId> {
        /**
         * Convert to protobuf representation.
         * @returns {PbArtifact} The converted artifact.
         */
        toProtobuf(): PbArtifact;
    }
}

declare module '@dolittle/sdk.execution' {
    class ExecutionContext {
        /**
         * Convert to protobuf representation.
         * @returns {PbExecutionContext} Protobuf representation.
         */
        toProtobuf(): PbExecutionContext;

        /**
         * Convert to protobuf call contex.
         * @returns {PbCallRequestContext} Protobuf representation.
         */
        toCallContext(): PbCallRequestContext;
    }

    class Claim {
        /**
         * Convert to protobuf representation.
         * @returns {PbClaim} The converted claim.
         */
        toProtobuf(): PbClaim;
    }

    class Claims {
        /**
         * Convert to protobuf representation.
         * @returns {PbClaim[]} The converted claims.
         */
        toProtobuf(): PbClaim[];
    }
    class Version {
        /**
         * Convert to protobuf representation.
         * @returns {PbVersion} The converted version.
         */
        toProtobuf(): PbVersion;
    }
}

declare module '@dolittle/contracts/Artifacts/Artifact_pb' {
    interface Artifact {
        /**
         * Convert to SDK representation.
         * @param {(Guid, Generation) => TArtifact} artifactFactory - The callback to use to construct the converted artifact type.
         * @returns {TArtifact} The converted artifact.
         * @template TArtifact The type of the artifact.
         * @template TId The type of the artifact id.
         */
        toSDK<TArtifact extends SdkArtifact<TId>, TId extends ArtifactIdLike>(artifactFactory: (id: Guid, generation: Generation) => TArtifact): TArtifact
    }
}

declare module '@dolittle/contracts/Execution/ExecutionContext_pb' {
    interface ExecutionContext {
        toSDK(): SdkExecutionContext;
    }
}

declare module '@dolittle/contracts/Protobuf/Failure_pb' {
    interface Failure {
        /**
         * Convert to SDK representation.
         * @returns {SdkFailure} The converted failure.
         */
        toSDK(): SdkFailure
    }
}

declare module '@dolittle/contracts/Protobuf/Uuid_pb' {
    interface Uuid {
        /**
         * Convert to SDK representation.
         * @returns {Guid} The converted GUID.
         */
        toSDK(): Guid
    }
}

declare module '@dolittle/contracts/Security/Claim_pb' {
    interface Claim {
        /**
         * Convert to SDK representation.
         * @returns {SdkClaim} The converted claim.
         */
        toSDK(): SdkClaim;
    }
}

declare module '@dolittle/contracts/Versioning/Version_pb' {
    interface Version {
        /**
         * Convert to SDK representation.
         * @returns {SdkVersion} The converted version.
         */
        toSDK(): SdkVersion;
    }
}

declare module './Failure' {
    interface Failure {
        /**
         * Convert to protobuf representation.
         * @returns {PbFailure} The converted failure.
         */
        toProtobuf(): PbFailure;
    }
}
