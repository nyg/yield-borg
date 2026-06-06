import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'

const eslintConfig = defineConfig([
   ...nextVitals,
   {
      rules: {
         indent: ['error', 3, { SwitchCase: 1 }],
         semi: ['error', 'never'],
         'react-hooks/exhaustive-deps': 'off',
         quotes: ['error', 'single']
      }
   },
   globalIgnores([
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      'public/**',
   ]),
])

export default eslintConfig
