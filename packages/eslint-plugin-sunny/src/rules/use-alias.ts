/**
 * @fileoverview 使用 @ 路径别名代替相对路径
 */

import path from 'node:path'
import { type TSESLint, type TSESTree } from '@typescript-eslint/utils'
import { AST_NODE_TYPES } from '@typescript-eslint/typescript-estree'

const rule: TSESLint.RuleModule<string, []> = {
    meta: {
        type: 'problem',
        docs: {
            description: '使用 @ 路径别名代替相对路径',
        },
        fixable: 'code',
        messages: {
            useAlias: '使用 @ 路径别名代替相对路径',
        },
        schema: [],
    },
    create(context): TSESLint.RuleListener {
        const fileName = context.filename

        return {
            ImportDeclaration(node) {
                contextReport(context, node, node.source.value, 'useAlias', fileName)
            },
            ImportExpression(node) {
                if (node.source.type === AST_NODE_TYPES.Literal && typeof node.source.value === 'string') {
                    contextReport(context, node, node.source.value, 'useAlias', fileName)
                }
            },
        }
    },
    defaultOptions: [],
}

export default rule

function contextReport(
    context: TSESLint.RuleContext<string, []>,
    node: TSESTree.ImportDeclaration | TSESTree.ImportExpression,
    value: string,
    messageId: string,
    filename: string
) {
    if (value.startsWith('../')) {
        const absolutePath = path.resolve(path.dirname(filename), value)
        const relativePath = 'src' + absolutePath.split('\\src')[1].replace(/\\/g, '/')

        context.report({
            node,
            messageId,
            fix: (fixer) => {
                return fixer.replaceText(node.source, `'${relativePath.replace('src', '@')}'`)
            },
        })
    }
}
