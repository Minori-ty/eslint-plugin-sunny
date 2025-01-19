import { describe, test } from 'vitest'
import { RuleTester, Rule } from 'eslint'
import rule from '../src/rules/no-className-allowed'
import parser from '@typescript-eslint/parser'

const ruleTester = new RuleTester({
    languageOptions: {
        parser,
        parserOptions: {
            ecmaVersion: 2020,
            sourceType: 'module',
            ecmaFeatures: {
                jsx: true,
            },
        },
    },
})

describe('测试 className 的使用', () => {
    test('禁止在页面中使用 className', () => {
        ruleTester.run('no-className-allowed', rule as unknown as Rule.RuleModule, {
            valid: [
                { code: '<div>1</div>', filename: 'page.tsx' },
                { code: '<MyComponent />', filename: 'page.tsx' },
            ],
            invalid: [
                {
                    code: '<div className="test"></div>',
                    errors: [{ messageId: 'className' }],
                    filename: 'page.tsx',
                },
            ],
        })
    })
})
