/**
 * @fileoverview 使用 @ 路径别名代替相对路径（仅当目标在 src 下）
 */

import path from 'node:path'
import { type TSESLint } from '@typescript-eslint/utils'

const rule: TSESLint.RuleModule<'useAlias', []> = {
    meta: {
        type: 'suggestion',
        docs: {
            description: '必须使用 @ 路径别名代替相对路径（仅当目标在 src 下）',
        },
        fixable: 'code',
        messages: {
            useAlias: '必须使用 @ 路径别名代替相对路径',
        },
        schema: [],
    },
    create(context) {
        const currentFilePath = context.filename // 当前文件的绝对路径

        return {
            ImportDeclaration(node) {
                const importSource = node.source.value // 'xxx/xxx' 这种路径字符串
                if (typeof importSource !== 'string') return

                // 如果是相对路径，解析为绝对路径
                if (!importSource.startsWith('.')) return
                const absolutePath = path.resolve(path.dirname(currentFilePath), importSource).replace(/\\/g, '/')

                if (!absolutePath.includes('/src/')) return

                const resetPath = absolutePath.split('src')[1]

                context.report({
                    node,
                    messageId: 'useAlias',
                    fix: (fixer) => fixer.replaceText(node.source, `'@${resetPath}'`),
                })
            },
        }
    },
    defaultOptions: [],
}

export default rule
