/**
 * @fileoverview 如果函数返回值不是 JSX.Element 或 FC，则要求 TSDoc 注释
 */

import type { TSESLint, TSESTree } from '@typescript-eslint/utils'
import { AST_NODE_TYPES } from '@typescript-eslint/typescript-estree'

const rule: TSESLint.RuleModule<string, []> = {
    meta: {
        type: 'problem',
        docs: {
            description: '如果函数返回值不是 JSX.Element 或 FC，则要求 tsdoc 注释',
        },
        fixable: 'code',
        messages: {
            missingTSDoc: '缺少 tsdoc 注释',
        },
        schema: [],
    },
    create(context: TSESLint.RuleContext<string, []>): TSESLint.RuleListener {
        return {
            FunctionDeclaration(node) {
                let returnsJSXElement = false

                // 检查函数体中的返回语句是否返回 JSX 元素
                const checkReturnStatement = (body: TSESTree.BlockStatement | TSESTree.Expression) => {
                    if (body.type === AST_NODE_TYPES.BlockStatement) {
                        body.body.forEach((statement) => {
                            if (statement.type === AST_NODE_TYPES.ReturnStatement) {
                                const argument = statement.argument
                                if (
                                    argument &&
                                    (argument.type === AST_NODE_TYPES.JSXElement ||
                                        argument.type === AST_NODE_TYPES.JSXFragment)
                                ) {
                                    returnsJSXElement = true
                                }
                            }
                        })
                    } else if (
                        body.type === AST_NODE_TYPES.ArrowFunctionExpression &&
                        body.body.type === AST_NODE_TYPES.JSXElement
                    ) {
                        returnsJSXElement = true
                    }
                }

                checkReturnStatement(node.body)

                // 检查是否有 TSDoc 注释
                const commentsBefore = context.sourceCode.getCommentsBefore(node)
                const commentsAfter = context.sourceCode.getCommentsAfter(node)
                const allComments = [...commentsBefore, ...commentsAfter]
                const hasTSDoc = allComments.some(
                    (comment) => comment.type === 'Block' && comment.value.startsWith('*')
                )

                if (!returnsJSXElement && !hasTSDoc) {
                    context.report({
                        node,
                        messageId: 'missingTSDoc',
                    })
                }
            },
        }
    },
    defaultOptions: [],
}

export default rule
