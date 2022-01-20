// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

type InformationResult = {
    type: 'information';
    message: string;
};

type FailureResult = {
    type: 'failure';
    message: string;
    fix?: string;
};

type ErrorResult = {
    type: 'error';
    error: Error;
};

/**
 * Defines a result of building a client.
 */
export type ClientBuildResult = InformationResult | FailureResult | ErrorResult;
