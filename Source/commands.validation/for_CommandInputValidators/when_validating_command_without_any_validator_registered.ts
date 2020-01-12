// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { CommandInputValidators } from '../CommandInputValidators';
import { MyCommand } from './given/a_command_and_validator';
import '@dolittle/validation';

describe('when validating command without any validator registered', () => {
        CommandInputValidators.clear();
        const validators = new CommandInputValidators();
        const result = validators.validate(new MyCommand());

        it('should be considered successful', () => result.isSuccess.should.be.true);
        it('should not have any broken rule', () => result.brokenRules.should.be.lengthOf(0));
});
