// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { CommandInputValidatorFor, CommandInputValidationResult, ICommand, ICommandInputValidators } from './index';
import { RuleSetContainerEvaluation } from '@dolittle/rules';

export class CommandInputValidators implements ICommandInputValidators {
    static _inputValidatorTypes: any = {};
    static _ruleSetContainerEvaluationPerCommand: any = {};

    /** @inheritdoc */
    validate(command: ICommand) {
        const type = command.constructor.prototype;
        if (!CommandInputValidators._ruleSetContainerEvaluationPerCommand.hasOwnProperty(type)) {
            return new CommandInputValidationResult([]);
        }

        const evaluation = CommandInputValidators._ruleSetContainerEvaluationPerCommand[type] as RuleSetContainerEvaluation;
        evaluation.evaluate(command);
        return new CommandInputValidationResult(evaluation.brokenRules.filter(_ => true));
    }

    /** @inheritdoc */
    hasValidatorFor<TCommand extends ICommand>(commandType: (new () => TCommand)) {
        return CommandInputValidators._ruleSetContainerEvaluationPerCommand.hasOwnProperty(commandType.prototype);
    }

    static register<TCommand extends ICommand>(commandType: (new () => TCommand), validatorType: (new () => CommandInputValidatorFor<TCommand>)) {
        CommandInputValidators._inputValidatorTypes[commandType.prototype] = validatorType;
        const builder = new validatorType();
        const container = builder.build();
        console.log(container.ruleSets[0].rules.length);
        const evaluation = new RuleSetContainerEvaluation(container);
        CommandInputValidators._ruleSetContainerEvaluationPerCommand[commandType.prototype] = evaluation;
    }
}
