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
     * @param {string} fix - The message that describes how to fix the issue.
     */
    constructor(fix: string) {
        super(`This version of the SDK (${VersionInfo.currentVersion}) is not compatible with the Dolittle Runtime you are connecting to. ${fix}.`);
    }

    /**
     * The exception to throw when the Runtime returns an unimplemented exception during the handshake.
     */
    static get unimplemented(): RuntimeVersionNotCompatible {
        return new RuntimeVersionNotCompatible('Please upgrade the Runtime to version 7.4.0 or later');
    }
}
