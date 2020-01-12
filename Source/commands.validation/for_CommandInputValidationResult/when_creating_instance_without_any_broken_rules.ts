// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { CommandInputValidationResult } from '../index';

describe('when creating instance without any broken rules', () => {
    const result = new CommandInputValidationResult([]);

    it('should be considered successful', () => result.isSuccess.should.be.true);
    it('should have a broken rule', () => result.brokenRules.should.be.lengthOf(1));
});
