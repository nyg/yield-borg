import { base } from '@nyg/eslint-config'
import { next } from '@nyg/eslint-config/next'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
   globalIgnores(['public/**']),
   base,
   next,
])
