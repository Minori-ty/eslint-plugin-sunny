/**
 * @fileoverview 如果函数返回值不是 React JSX 元素，则强制要求 tsdoc 注释，并控制缩进。
 */

import type { TSESLint, TSESTree } from '@typescript-eslint/utils'
import { AST_NODE_TYPES } from '@typescript-eslint/typescript-estree'

const rule: TSESLint.RuleModule<string, []> = {
    meta: {
        type: 'problem',
        docs: {
            description: '如果函数返回值不是 React JSX 元素，则强制要求 tsdoc 注释，并控制缩进。',
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

                // 检查是否有 JSDoc 注释
                let hasJSDoc = false
                if (
                    node.parent.type === AST_NODE_TYPES.ExportDefaultDeclaration ||
                    node.parent.type === AST_NODE_TYPES.ExportNamedDeclaration
                ) {
                    const commentsBefore = context.sourceCode.getCommentsBefore(node.parent)
                    hasJSDoc = commentsBefore.some(
                        (comment) => comment.type === 'Block' && comment.value.startsWith('*')
                    )
                } else {
                    const commentsBefore = context.sourceCode.getCommentsBefore(node)
                    hasJSDoc = commentsBefore.some(
                        (comment) => comment.type === 'Block' && comment.value.startsWith('*')
                    )
                }

                // 如果函数返回的不是 JSX，并且没有 JSDoc 注释，则生成 JSDoc 注释
                if (!returnsJSXElement && !hasJSDoc) {
                    context.report({
                        node,
                        messageId: 'missingTSDoc',
                        fix: (fixer) => {
                            if (
                                node.parent.type === AST_NODE_TYPES.ExportDefaultDeclaration ||
                                node.parent.type === AST_NODE_TYPES.ExportNamedDeclaration
                            ) {
                                // 生成 @param 注释（只有在有参数时才生成）
                                const params = node.params
                                    .map((param) => {
                                        const paramName =
                                            param.type === AST_NODE_TYPES.Identifier ? param.name : 'unknown'
                                        return ` * @param ${paramName} -` // 使用动态缩进
                                    })
                                    .join('\n')

                                // 生成 JSDoc 注释，控制缩进
                                const jsDocComment = node.params.length > 0 ? `/**\n${params}\n */\n` : `/**\n *\n */\n`
                                // 如果父节点是 ExportDefaultDeclaration，则插入到父节点的起始位置
                                const start = node.parent.range[0]
                                return fixer.insertTextBeforeRange([start, start], jsDocComment)
                                // return fixer.insertTextBefore(node, jsDocComment)
                            } else {
                                // 获取函数声明的位置的缩进
                                const indent = ' '.repeat(node.loc.start.column)

                                // 生成 @param 注释（只有在有参数时才生成）
                                const params = node.params
                                    .map((param) => {
                                        const paramName =
                                            param.type === AST_NODE_TYPES.Identifier ? param.name : 'unknown'
                                        return `${indent} * @param ${paramName} -` // 使用动态缩进
                                    })
                                    .join('\n')

                                // 生成 JSDoc 注释，控制缩进
                                const jsDocComment =
                                    node.params.length > 0
                                        ? `/**\n${params}\n${indent} */\n${indent}`
                                        : `/**\n${indent} *\n${indent} */\n${indent}`
                                // 否则插入到函数声明之前
                                return fixer.insertTextBefore(node, jsDocComment)
                            }
                        },
                    })
                }
            },
        }
    },
    defaultOptions: [],
}

export default rule
