// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ConceptAs } from '@dolittle/concepts';

/**
 * Represents a projection key selector expression.
 */
export class PropertyNameKeySelector extends ConceptAs<string, '@dolittle/sdk.projections.PropertyNameKeySelector'> {
    /**
     * Initializes a new instance of {@link PropertyNameKeySelector}.
     * @param {string} expression - The expression that specifices the key selection.
     */
    constructor(expression: string) {
        super(expression, '@dolittle/sdk.projections.PropertyNameKeySelector');
    }

    /**
     * Creates a {@link PropertyNameKeySelector} from a string.
     * @param {string | PropertyNameKeySelector} expression - The expression to convert.
     * @returns {PropertyNameKeySelector} The converted key selector.
     */
    static from(expression: string | PropertyNameKeySelector): PropertyNameKeySelector {
        if (expression instanceof PropertyNameKeySelector) {return expression;}
        return new PropertyNameKeySelector(expression);
    }
}
