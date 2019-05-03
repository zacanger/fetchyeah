import ts from 'rollup-plugin-typescript'
import json from 'rollup-plugin-json'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import builtins from 'rollup-plugin-node-builtins'
import { uglify } from 'rollup-plugin-uglify'
import { minify } from 'uglify-es'

export default {
  input: 'src/index.ts',
  output: {
    file: 'lib/index.js',
    format: 'umd',
    name: 'boilerplate',
    sourcemap: true,
  },
  plugins: [
    json({
      preferConst: true,
      indent: '  ',
    }),
    builtins(),
    resolve({
      jsnext: true,
      main: true,
      browser: true,
    }),
    uglify({}, minify),
    commonjs({
      include: 'node_modules/**',
      extensions: ['.js'],
    }),
    ts(),
  ],
}
