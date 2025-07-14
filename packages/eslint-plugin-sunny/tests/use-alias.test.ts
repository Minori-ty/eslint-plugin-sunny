import { RuleTester } from './RuleTester'
import rule from '../src/rules/use-alias' // 替换为实际规则路径
import { AST_NODE_TYPES } from '@typescript-eslint/typescript-estree'
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
ruleTester.run('use-path-alias', rule, {
    valid: [
        // 非相对路径不报错
        {
            code: "import { func } from 'lodash';",
        },
        // 已使用别名的路径不报错
        {
            code: "import { Button } from '@/components/Button';",
        },
    ],

    invalid: [
        // 基础配置：@ 指向 src
        {
            code: "import { Button } from '../components/Button';",
            filename: 'C:\\project\\src\\pages\\Home.tsx',
            errors: [
                {
                    messageId: 'useAlias',
                    type: AST_NODE_TYPES.ImportDeclaration,
                },
            ],
            output: "import { Button } from '@/components/Button';",
        },
        {
            code: "import { Button } from './components/Button';",
            filename: 'C:\\project\\src\\App.tsx',
            errors: [
                {
                    messageId: 'useAlias',
                    type: AST_NODE_TYPES.ImportDeclaration,
                },
            ],
            output: "import { Button } from '@/components/Button';",
        },
        {
            code: "import { get } from '../http/index';",
            filename: 'C:\\project\\src\\utils\\api\\index.ts',
            errors: [
                {
                    messageId: 'useAlias',
                    type: AST_NODE_TYPES.ImportDeclaration,
                },
            ],
            output: "import { get } from '@/utils/http/index';",
        },
    ],
})
