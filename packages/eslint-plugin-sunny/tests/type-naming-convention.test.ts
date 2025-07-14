import { RuleTester } from './RuleTester'
import rule, { EMessage } from '../src/rules/type-naming-convention' // 替换为实际规则路径
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

ruleTester.run('naming-convention', rule, {
    valid: [
        'interface IUser { name: string; }',
        'type TUser = { name: string; }',
        'enum EStatus { Active, Inactive }',
        // 测试引用更新
        `
        interface IUser { name: string; }
        const user: IUser = { name: 'test' };
      `,
        `
        type TUser = { name: string; };
        const user: TUser = { name: 'test' };
      `,
        `
        enum EStatus { Active, Inactive }
        const status: EStatus = EStatus.Active;
      `,
    ],

    invalid: [
        {
            code: 'interface User { name: string; }',
            errors: [{ messageId: EMessage.interfaceName, type: AST_NODE_TYPES.TSInterfaceDeclaration }],
            output: 'interface IUser { name: string; }',
        },
        {
            code: 'type User = { name: string; }',
            errors: [{ messageId: EMessage.typeAliasName, type: AST_NODE_TYPES.TSTypeAliasDeclaration }],
            output: 'type TUser = { name: string; }',
        },
        {
            code: 'enum Status { Active, Inactive }',
            errors: [{ messageId: EMessage.enumName, type: AST_NODE_TYPES.TSEnumDeclaration }],
            output: 'enum EStatus { Active, Inactive }',
        },
        {
            code: `
          interface User { name: string; }
          const user: User = { name: 'test' };
        `,
            errors: [
                {
                    messageId: EMessage.interfaceName,
                    type: AST_NODE_TYPES.TSInterfaceDeclaration,
                },
                {
                    messageId: EMessage.interfaceName,
                    type: AST_NODE_TYPES.TSTypeReference,
                },
            ],
            output: `
          interface IUser { name: string; }
          const user: IUser = { name: 'test' };
        `,
        },
        {
            code: `
          type User = { name: string; };
          const user: User = { name: 'test' };
        `,
            errors: [
                {
                    messageId: EMessage.typeAliasName,
                    type: AST_NODE_TYPES.TSTypeAliasDeclaration,
                },
                { messageId: EMessage.typeAliasName, type: AST_NODE_TYPES.TSTypeReference },
            ],
            output: `
          type TUser = { name: string; };
          const user: TUser = { name: 'test' };
        `,
        },
        {
            code: `
          enum Status { Active, Inactive }
          const status: Status = Status.Active;
        `,
            errors: [
                {
                    messageId: EMessage.enumName,
                    type: AST_NODE_TYPES.TSEnumDeclaration,
                },
                { messageId: EMessage.enumName, type: AST_NODE_TYPES.TSTypeReference },
                { messageId: EMessage.enumName, type: AST_NODE_TYPES.Identifier },
            ],
            output: `
          enum EStatus { Active, Inactive }
          const status: EStatus = EStatus.Active;
        `,
        },
        {
            code: `
          enum Status { Active, Inactive }
          function getStatus(): Status {
            return Status.Inactive;
          }
        `,
            errors: [
                { messageId: EMessage.enumName, type: AST_NODE_TYPES.TSEnumDeclaration },
                { messageId: EMessage.enumName, type: AST_NODE_TYPES.TSTypeReference },
                { messageId: EMessage.enumName, type: AST_NODE_TYPES.Identifier },
            ],
            output: `
          enum EStatus { Active, Inactive }
          function getStatus(): EStatus {
            return EStatus.Inactive;
          }
        `,
        },
        {
            code: `
          const enum Status { Active, Inactive }
          function getStatus(): Status {
            return Status.Inactive;
          }
        `,
            errors: [
                { messageId: EMessage.enumName, type: AST_NODE_TYPES.TSEnumDeclaration },
                { messageId: EMessage.enumName, type: AST_NODE_TYPES.TSTypeReference },
                { messageId: EMessage.enumName, type: AST_NODE_TYPES.Identifier },
            ],
            output: `
          const enum EStatus { Active, Inactive }
          function getStatus(): EStatus {
            return EStatus.Inactive;
          }
        `,
        },
    ],
})
