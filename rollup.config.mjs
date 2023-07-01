import { readFileSync } from 'fs'

import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'

const minifier = () => terser({ format: { comments: false } })

const pkg = JSON.parse(
  readFileSync(
    new URL('./package.json', import.meta.url),
    'utf8'
  )
)

export default {
  input: 'src/index.ts',
  output: [
    {
      exports: 'auto',
      file: pkg.main,
      format: 'cjs',
      plugins: [minifier()]
    },
    {
      file: pkg.module,
      format: 'es',
      plugins: [minifier()]
    }
  ],
  plugins: [
    resolve(),
    commonjs({ include: './node_modules/**' }),
    typescript({ include: '**/*.{ts,js}' })
  ],
  strictDeprecations: true
}
