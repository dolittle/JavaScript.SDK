// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ICommand, CommandInputValidators } from './index';
import { ObjectRuleSetContainerBuilder } from '@dolittle/rules';

import '@dolittle/validation';

export class CommandInputValidatorFor<TCommand extends ICommand> extends ObjectRuleSetContainerBuilder<TCommand> {

}
