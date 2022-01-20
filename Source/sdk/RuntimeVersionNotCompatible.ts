// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IDolittleClient } from './IDolittleClient';
import { VersionInfo } from './VersionInfo';

/**
 * The exception that gets thrown when trying to connect the {@link IDolittleClient} to a Runtime that is not compatible with this version of the SDK.
 */
export class RuntimeVersionNotCompatible extends Error {
    /**
     * Initialises a new instance of the {@link RuntimeVersionNotCompatible} class.
     * @param {string} runtimeHost - The Dolittle Runtime host address.
     * @param {string} runtimePort - The Dolittle Runtime address port.
     * @param {string} fix - The message that describes how to fix the issue.
     */
    constructor(runtimeHost: string, runtimePort: number, fix: string) {
        super(`This version of the SDK (${VersionInfo.currentVersion}) is not compatible with the Dolittle Runtime you are connecting to ${runtimeHost}:${runtimePort}. ${fix}.`);
    }

    /**
     * The exception to throw when the Runtime returns an unimplemented exception during the handshake.
     * @param {string} runtimeHost - The Dolittle Runtime host address.
     * @param {string} runtimePort - The Dolittle Runtime address port.
     * @returns {RuntimeVersionNotCompatible} The {@link RuntimeVersionNotCompatible}.
     */
    static unimplemented(runtimeHost: string, runtimePort: number): RuntimeVersionNotCompatible {
        return new RuntimeVersionNotCompatible(runtimeHost, runtimePort, 'Please upgrade the Runtime to version 7.4.0 or later');
    }
}
