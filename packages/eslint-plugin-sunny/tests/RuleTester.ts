import { describe, it, afterAll } from 'vitest'
import { RuleTester } from '@typescript-eslint/rule-tester'

RuleTester.afterAll = afterAll
RuleTester.describe = describe
RuleTester.it = it

export { RuleTester }
