// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { CommandInputValidators } from '../CommandInputValidators';
import { MyCommand, MyCommandValidationRules } from './given/a_command_and_validator';
import '@dolittle/validation';

describe('when validating command that violates rules', () => {
        CommandInputValidators.clear();
        CommandInputValidators.register(MyCommand, MyCommandValidationRules);
        const validators = new CommandInputValidators();
        const result = validators.validate(new MyCommand());

        it('should be considered failed', () => result.isSuccess.should.be.false);
        it('should have one broken rule', () => result.brokenRules.should.be.lengthOf(1));
});
