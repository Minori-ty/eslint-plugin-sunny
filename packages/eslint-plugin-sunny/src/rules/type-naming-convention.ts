/**
 * @fileoverview 强制接口以大写"I"开头, 类型以大写"T"开头, 枚举以大写"E"开头
 */

import { type TSESLint } from '@typescript-eslint/utils'
import { AST_NODE_TYPES, type TSESTree } from '@typescript-eslint/typescript-estree'

export const enum EMessage {
    interfaceName = 'interfaceName',
    typeAliasName = 'typeAliasName',
    enumName = 'enumName',
}
const rule: TSESLint.RuleModule<EMessage, []> = {
    meta: {
        type: 'problem',
        docs: {
            description: '强制接口以大写"I"开头, 类型以大写"T"开头, 枚举以大写"E"开头',
        },
        fixable: 'code', // 规则支持自动修复
        schema: [], // 不需要额外的配置
        messages: {
            interfaceName: 'interface 必须以大写I开头',
            typeAliasName: 'type 必须以大写T开头',
            enumName: 'enum 必须以大写E开头',
        },
    },
    create(context: TSESLint.RuleContext<EMessage, []>): TSESLint.RuleListener {
        const renamedTypes = new Map<string, string>() // 用来存储已重命名的类型

        // 检查接口命名是否符合要求
        function checkInterfaceNaming(node: TSESTree.TSInterfaceDeclaration) {
            const name = node.id.name
            if (!name.startsWith('I')) {
                const newName = `I${name}`
                renamedTypes.set(name, newName)
                context.report({
                    node,
                    messageId: EMessage.interfaceName,
                    fix: (fixer) => fixer.replaceText(node.id, newName),
                })
            }
        }

        // 检查类型别名命名是否符合要求
        function checkTypeAliasNaming(node: TSESTree.TSTypeAliasDeclaration) {
            const name = node.id.name
            if (!name.startsWith('T')) {
                const newName = `T${name}`
                renamedTypes.set(name, newName)
                context.report({
                    node,
                    messageId: EMessage.typeAliasName,
                    fix: (fixer) => fixer.replaceText(node.id, newName),
                })
            }
        }

        // 检查枚举命名是否符合要求
        function checkEnumNaming(node: TSESTree.TSEnumDeclaration) {
            const name = node.id.name
            if (!name.startsWith('E')) {
                const newName = `E${name}`
                renamedTypes.set(name, newName)
                context.report({
                    node,
                    messageId: EMessage.enumName,
                    fix: (fixer) => fixer.replaceText(node.id, newName),
                })
            }
        }

        return {
            // 处理接口定义
            TSInterfaceDeclaration(node) {
                checkInterfaceNaming(node)
            },

            // 处理类型别名定义
            TSTypeAliasDeclaration(node) {
                checkTypeAliasNaming(node)
            },

            // 处理枚举定义
            TSEnumDeclaration(node) {
                checkEnumNaming(node)
            },
            // 处理类型引用
            TSTypeReference(node) {
                if (node.typeName.type !== AST_NODE_TYPES.Identifier) return
                const name = node.typeName.name
                const newName = renamedTypes.get(name)
                if (newName) {
                    // 根据类型决定messageId
                    let messageId: EMessage
                    if (newName.startsWith('I')) {
                        messageId = EMessage.interfaceName
                    } else if (newName.startsWith('T')) {
                        messageId = EMessage.typeAliasName
                    } else if (newName.startsWith('E')) {
                        messageId = EMessage.enumName
                    } else {
                        return
                    }

                    context.report({
                        node,
                        messageId,
                        fix: (fixer) => fixer.replaceText(node.typeName, newName),
                    })
                }
            },

            // 处理对象成员引用类型（例如：`MyType.MyEnum`）
            MemberExpression(node) {
                if (node.object.type !== AST_NODE_TYPES.Identifier) return
                const typeName = node.object.name
                const newName = renamedTypes.get(typeName)
                if (newName) {
                    context.report({
                        node: node.object,
                        messageId: EMessage.enumName,
                        fix: (fixer) => fixer.replaceText(node.object, newName),
                    })
                }
            },

            // 修复常量枚举赋值（例如：`const EEnumValue = EEnum.SomeValue`）
            AssignmentExpression(node) {
                if (node.left.type !== AST_NODE_TYPES.Identifier) return
                const typeName = node.left.name
                const newName = renamedTypes.get(typeName)
                if (newName) {
                    context.report({
                        node: node.left,
                        messageId: EMessage.enumName,
                        fix: (fixer) => fixer.replaceText(node.left, newName),
                    })
                }
            },
        }
    },
    defaultOptions: [],
}

export default rule
