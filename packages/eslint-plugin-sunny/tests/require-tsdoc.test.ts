import { RuleTester } from './RuleTester'
import rule from '../src/rules/require-tsdoc' // 替换为实际规则路径
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

ruleTester.run('require-tsdoc-if-not-jsx', rule, {
    valid: [
        {
            code: `
      /**
       * @param name -
       */
      function greet(name: string) {
        return 'hello ' + name;
      }
      `,
        },
        {
            code: `
      function App() {
        return <div>Hello</div>;
      }
      `,
        },
        {
            code: `
          /**
           *
           */
          export default function noParam() {
            return 42;
          }
          `,
        },
    ],
    invalid: [
        {
            code: `
      function add(a: number, b: number) {
        return a + b;
      }
      `,
            output: `
      /**
       * @param a -
       * @param b -
       */
      function add(a: number, b: number) {
        return a + b;
      }
      `,
            errors: [{ messageId: 'missingTSDoc' }],
        },
        // {
        //     code: `
        //   export function sayHi(name: string) {
        //     return \`Hi, \${name}\`;
        //   }
        //   `,
        //     output: `
        //   /**
        //    * @param name -
        //    */
        //   export function sayHi(name: string) {
        //     return \`Hi, \${name}\`;
        //   }
        //   `,
        //     errors: [{ messageId: 'missingTSDoc' }],
        // },
        {
            code: `
        function noParams() {
          return 1;
        }
      `,
            output: `
        /**
         *
         */
        function noParams() {
          return 1;
        }
      `,
            errors: [{ messageId: 'missingTSDoc' }],
        },
    ],
})
