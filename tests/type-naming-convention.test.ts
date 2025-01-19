import { describe, it, expect, test } from 'vitest'
import { RuleTester, Rule } from 'eslint'
import rule from '../src/rules/type-naming-convention'
import parser from '@typescript-eslint/parser'

const ruleTester = new RuleTester({
    languageOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
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

describe('测试类型命名规范', () => {
    test('类型命名规范', () => {
        ruleTester.run('type-naming-convention', rule as unknown as Rule.RuleModule, {
            valid: [
                { code: 'interface IMyInterface {}' },
                { code: 'type TMyType = string;' },
                { code: 'enum EMyEnum { VALUE }' },
            ],
            invalid: [
                {
                    code: 'interface myInterface {}',
                    errors: [{ messageId: 'interfaceName' }],
                    filename: 'page.tsx',
                },
                {
                    code: 'type myType = string;',
                    errors: [{ messageId: 'typeAliasName' }],
                    filename: 'page.tsx',
                },
                {
                    code: 'enum myEnum { VALUE }',
                    errors: [{ messageId: 'enumName' }],
                    filename: 'page.tsx',
                },
            ],
        })
    })
})
