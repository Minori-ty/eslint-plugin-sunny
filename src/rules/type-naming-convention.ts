/**
 * @fileoverview 强制接口以大写"I"开头, 类型以大写"T"开头, 枚举以大写"E"开头
 */

import type { TSESLint } from '@typescript-eslint/utils'

type TMessageId = 'interfaceName' | 'typeAliasName' | 'enumName'

const rule: TSESLint.RuleModule<TMessageId, []> = {
    meta: {
        type: 'problem',
        docs: {
            description: '强制接口以大写"I"开头, 类型以大写"T"开头, 枚举以大写"E"开头',
        },
        fixable: 'code',
        schema: [],
        messages: {
            interfaceName: 'interface 必须以大写I开头',
            typeAliasName: 'type 必须以大写T开头',
            enumName: 'enum 必须以大写E开头',
        },
    },
    create(context: TSESLint.RuleContext<TMessageId, []>): TSESLint.RuleListener {
        return {
            TSInterfaceDeclaration(node) {
                if (!node.id.name.startsWith('I')) {
                    context.report({
                        node,
                        messageId: 'interfaceName',
                        fix: (fixer) => {
                            return fixer.replaceText(node.id, `I${node.id.name}`)
                        },
                    })
                }
            },
            TSTypeAliasDeclaration(node) {
                if (!node.id.name.startsWith('T')) {
                    context.report({
                        node,
                        messageId: 'typeAliasName',
                        fix: (fixer) => {
                            return fixer.replaceText(node.id, `T${node.id.name}`)
                        },
                    })
                }
            },
            TSEnumDeclaration(node) {
                if (!node.id.name.startsWith('E')) {
                    context.report({
                        node,
                        messageId: 'enumName',
                        fix: (fixer) => {
                            return fixer.replaceText(node.id, `E${node.id.name}`)
                        },
                    })
                }
            },
        }
    },
    defaultOptions: [],
}

export default rule
