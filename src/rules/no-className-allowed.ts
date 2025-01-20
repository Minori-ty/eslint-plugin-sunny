/**
 * @fileoverview 禁止在 page.{js,ts,jsx,tsx} 文件中使用 className
 */

import path from 'node:path'
import type { TSESLint } from '@typescript-eslint/utils'

const rule: TSESLint.RuleModule<string, []> = {
    meta: {
        type: 'problem',
        docs: {
            description: '禁止在 page.{js,ts,jsx,tsx} 文件中使用 className',
        },
        fixable: 'code',
        messages: {
            js: '在 page.js 文件中不允许使用 className。',
            ts: '在 page.ts 文件中不允许使用 className。',
            jsx: '在 page.jsx 文件中不允许使用 className。',
            tsx: '在 page.tsx 文件中不允许使用 className。',
        },
        schema: [],
    },
    create(context: TSESLint.RuleContext<string, []>): TSESLint.RuleListener {
        const fileName = path.basename(context.filename)
        const fileExt = path.extname(fileName).slice(1)

        // 检查文件名是否为 page.{js,ts,jsx,tsx}
        if (!fileName.match(/page\.(js|ts|jsx|tsx)$/)) {
            return {} // 如果不是 page.{js,ts,jsx,tsx}，返回空对象
        }

        return {
            JSXAttribute(node) {
                if (node.name.name === 'className') {
                    context.report({
                        node,
                        messageId: fileExt,
                        fix: (fixer) => {
                            // 删除 className 属性
                            return fixer.remove(node)
                        },
                    })
                }
            },
        }
    },
    defaultOptions: [],
}

export default rule
