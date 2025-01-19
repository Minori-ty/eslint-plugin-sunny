import typeCaseRule from './rules/type-naming-convention'
import noClassNameAllowedRule from './rules/no-className-allowed'

export const rules = {
    'type-naming-convention': typeCaseRule,
    'no-className-allowed': noClassNameAllowedRule,
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
        },
    },
}

export default {
    rules,
    configs,
}
