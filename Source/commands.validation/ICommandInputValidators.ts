// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { CommandInputValidationResult } from './index';
import { ICommand } from '@dolittle/sdk.commands';

/**
 * Defines the system for working with input validators for commands.
 */
export interface ICommandInputValidators {

    /**
     * Perform validation of a specific command.
     * @param {ICommand} command - Command to validate.
     * @returns {CommandInputValidationResult}
     */
    validate(command: ICommand): CommandInputValidationResult;

    /**
     * Check if there is a validator for a specific type of command.
     * @param {TCommand} commandType - Type of command to check if there is validator for.
     * @param boolean - true if there is a validator, false if not.
     */
    hasValidatorFor<TCommand extends ICommand>(commandType: (new () => TCommand)): Boolean;
}
