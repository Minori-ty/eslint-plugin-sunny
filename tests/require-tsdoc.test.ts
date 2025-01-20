import { describe, test } from 'vitest'
import { RuleTester, Rule } from 'eslint'
import rule from '../src/rules/require-tsdoc'
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

describe('测试 TSDoc 的要求', () => {
    test('函数返回值是 JSX.Element 或 FC，不要求 TSDoc', () => {
        ruleTester.run('require-tsdoc', rule as unknown as Rule.RuleModule, {
            valid: [
                {
                    code: 'function MyComponent(): JSX.Element { return <div></div>; }',
                },
                {
                    code: `
                        /**
                         * @description This is a function
                         */
                        function MyFunction() { return 42; }
                    `,
                },
                {
                    code: `
                        /**
                         * @description This is another function
                         */
                        function AnotherFunction(): number { return 42; }
                    `,
                },
            ],
            invalid: [
                {
                    code: 'function MyFunction() { return 42; }',
                    errors: [{ messageId: 'missingTSDoc' }],
                },
                {
                    code: 'function AnotherFunction(): number { return 42; }',
                    errors: [{ messageId: 'missingTSDoc' }],
                },
            ],
        })
    })
})
