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
            className: '在 page.{js,ts,jsx,tsx} 文件中不允许使用 className。',
        },
        schema: [],
    },
    create(context) {
        const fileName = path.basename(context.filename)

        // 检查文件名是否为 page.{js,ts,jsx,tsx}
        if (fileName.match(/page\.(js|ts|jsx|tsx)$/)) {
            return {
                JSXAttribute(node) {
                    if (node.name.name === 'className') {
                        context.report({
                            node,
                            messageId: `在 ${fileName} 文件中不允许使用 className。`,
                        })
                    }
                },
            }
        }

        return {} // 如果不是 page.{js,ts,jsx,tsx}，返回空对象
    },
    defaultOptions: [],
}

export default rule
