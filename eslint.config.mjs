import { base } from '@nyg/eslint-config'
import { nextWithTypescript } from '@nyg/eslint-config/next'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
   globalIgnores(['public/**']),
   base,
   nextWithTypescript,
])
