// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ConceptAs } from '@dolittle/concepts';

/**
 * Represents a projection key selector expression.
 */
export class KeySelectorExpression extends ConceptAs<string, '@dolittle/sdk.projections.KeySelectorExpression'> {
    /**
     * Initializes a new instance of {@link KeySelectorExpression}
     * @param expression The expression that specifices the key selection.
     */
    constructor(expression: string) {
        super(expression, '@dolittle/sdk.projections.KeySelectorExpression');
    }

    /**
     * Creates a {@link KeySelectorExpression} from a string.
     *
     * @static
     * @param {string | KeySelectorExpression} expression
     * @returns {KeySelectorExpression}
     */
    static from(expression: string | KeySelectorExpression): KeySelectorExpression {
        if (expression instanceof KeySelectorExpression) {return expression;}
        return new KeySelectorExpression(expression);
    }
}
