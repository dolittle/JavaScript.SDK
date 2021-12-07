// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Version } from '@dolittle/sdk.execution';

/**
 * Provides information about the current version of the Dolittle JS SDK version.
 */
export class VersionInfo {
    /**
     * Gets the current {@link Version} of the Dolittle JS SDK.
     */
    static get currentVersion(): Version {
        return new Version(377, 389, 368, 0, 'PRERELEASE');
    }
}
