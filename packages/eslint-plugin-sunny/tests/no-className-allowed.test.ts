import { describe } from 'vitest'
import { RuleTester } from './RuleTester'
import rule from '../src/rules/no-className-allowed'
import parser from '@typescript-eslint/parser'

// 使用和 ESLint 一致的 parser
const ruleTester = new RuleTester({
    languageOptions: {
        parser: parser,
        parserOptions: {
            ecmaVersion: 2021,
            sourceType: 'module',
            ecmaFeatures: {
                jsx: true,
            },
        },
    },
})
describe('no-classname-in-page', () => {
    ruleTester.run('no-classname-in-page', rule, {
        valid: [
            {
                // 不是 page.jsx 文件
                code: `<div className="test" />`,
                filename: 'component.jsx',
            },
            {
                // page 文件中没有 className
                code: `<div  />`,
                filename: 'page.tsx',
            },
        ],
        invalid: [
            {
                code: `<div className="test" />`,
                filename: 'page.tsx',
                errors: [{ messageId: 'tsx' }],
                output: `<div  />`,
            },
            {
                code: `<span className="abc" />`,
                filename: 'page.jsx',
                errors: [{ messageId: 'jsx' }],
                output: `<span  />`,
            },
            {
                code: `<header className="foo" />`,
                filename: 'page.js',
                errors: [{ messageId: 'js' }],
                output: `<header  />`,
            },
        ],
    })
})
