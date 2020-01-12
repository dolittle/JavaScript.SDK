// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { CommandInputValidators } from '../CommandInputValidators';
import { MyCommand, MyCommandValidationRules } from './given/a_command_and_validator';
import '@dolittle/validation';

describe('when asking for validator for type for validator registered statically', () => {
        CommandInputValidators.register(MyCommand, MyCommandValidationRules);
        const validators = new CommandInputValidators();

        const hasValidator = validators.hasValidatorFor(MyCommand);

        it('should have a validator', () => hasValidator.should.be.true);
});
