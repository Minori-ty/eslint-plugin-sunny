import typeCaseRule from './rules/type-naming-convention'
import noClassNameAllowedRule from './rules/no-className-allowed'
import requireTSDocRule from './rules/require-tsdoc'
import useAlias from './rules/use-alias'

export const rules = {
    'type-naming-convention': typeCaseRule,
    'no-className-allowed': noClassNameAllowedRule,
    'require-tsdoc': requireTSDocRule,
    'use-alias': useAlias,
}

export const configs = {
    recommended: {
        plugins: {
            sunny: {
                rules,
            },
        },
        rules: {
            'sunny/type-naming-convention': 'error',
            'sunny/no-className-allowed': 'error',
            'sunny/require-tsdoc': 'error',
            'sunny/use-alias': 'error',
        },
    },
}

export default {
    rules,
    configs,
}
