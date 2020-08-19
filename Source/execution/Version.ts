// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

/**
 * Represents a version number adhering to the SemVer 2.0 standard.
 */
export class Version {
    readonly major: number;
    readonly minor: number;
    readonly patch: number;
    readonly build: number;
    readonly preReleaseString: string;

    /**
     * Initializes a new instance of {@link Version}.
     * @param {number} major Major version of the software.
     * @param {number} minor Minor version of the software.
     * @param {number} patch Path level of the software.
     * @param {number} build Builder number of the software.
     * @param {string} [preReleaseString] If prerelease - the prerelease string.
     */
    constructor(major: number, minor: number, patch: number, build: number, preReleaseString = '') {
        this.major = major;
        this.minor = minor;
        this.patch = patch;
        this.build = build;
        this.preReleaseString = preReleaseString;
    }

    /**
     * Gets a {Version} that is not set.
     */
    static readonly notSet = new Version(0, 0, 0, 0);

    /**
     * First version
     */
    static readonly first = new Version(1, 0, 0, 0);

    toString() {
        let version = `${this.major}.${this.minor}.${this.patch}`;
        if (this.preReleaseString) {
            version = `${version}-${this.preReleaseString}.${this.build}`;
        }
        return version;
    }
}
