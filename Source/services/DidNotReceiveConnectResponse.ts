// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

/**
 * Exception that gets thrown when the first message from a Reverse Call Dispatcher does not contain a Connect Response.
 */
export class DidNotReceiveConnectResponse extends Error {

    /**
     * Initializes a new instance of {@link DidNotReceiveConnectResponse}.
     */
    constructor() {
        super('Did not receive connect response. Server message did not contain the connect response');
    }
}
