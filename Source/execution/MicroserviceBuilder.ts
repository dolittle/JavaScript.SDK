// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { MicroserviceId, Version } from './index';

export type MicroserviceBuilderCallback = (builder: MicroserviceBuilder) => void;

/**
 * Represents a builder for configuring the microservice.
 */
export class MicroserviceBuilder {
    private _version: Version = Version.first;

    constructor(readonly _microserviceId: MicroserviceId) {}

    /**
     * Sets a version for the microservice.
     * @param {Version} version  The version of the software.
     * @returns {ClientBuilder} The client builder for continuation.
     */
    withVersion(version: Version) {
        this._version = version;
        return this;
    }

    build(): [MicroserviceId, Version] {
        return [this._microserviceId, this._version];
    }
}
