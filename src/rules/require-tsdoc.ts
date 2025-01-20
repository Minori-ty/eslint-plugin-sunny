/**
 * @fileoverview 如果函数返回值不是 JSX.Element 或 FC，则要求 TSDoc 注释
 */

import { TSESLint, TSESTree } from '@typescript-eslint/utils'
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
                let hasTSDoc = false
                if (
                    node.parent.type === AST_NODE_TYPES.ExportDefaultDeclaration ||
                    node.parent.type === AST_NODE_TYPES.ExportNamedDeclaration
                ) {
                    const commentsBefore = context.sourceCode.getCommentsBefore(node.parent)
                    hasTSDoc = commentsBefore.some(
                        (comment) => comment.type === 'Block' && comment.value.startsWith('*')
                    )
                } else {
                    const commentsBefore = context.sourceCode.getCommentsBefore(node)
                    hasTSDoc = commentsBefore.some(
                        (comment) => comment.type === 'Block' && comment.value.startsWith('*')
                    )
                }

                if (!returnsJSXElement && !hasTSDoc) {
                    // 生成 @param 注释
                    const params = node.params
                        .map((param) => {
                            const paramName = param.type === AST_NODE_TYPES.Identifier ? param.name : 'unknown'
                            return ` * @param ${paramName} - ` // 这里可以添加更详细的描述
                        })
                        .join('\n')

                    const tsdocComment = `/**\n${params}\n */\n` // 使用生成的参数注释

                    context.report({
                        node,
                        messageId: 'missingTSDoc',
                        fix: (fixer) => {
                            if (
                                node.parent.type === AST_NODE_TYPES.ExportDefaultDeclaration ||
                                node.parent.type === AST_NODE_TYPES.ExportNamedDeclaration
                            ) {
                                // 如果父节点是 ExportDefaultDeclaration，则插入到父节点的起始位置
                                const start = node.parent.range[0]
                                return fixer.insertTextBeforeRange([start, start], tsdocComment)
                            } else {
                                // 否则插入到函数声明之前
                                return fixer.insertTextBefore(node, tsdocComment)
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
