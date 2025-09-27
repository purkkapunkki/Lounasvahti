import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import css from 'rollup-plugin-import-css';
import {watch} from 'rollup';

export default {
  input: './src/main.ts',
  output: {
    file: './build/main.js',
    format: 'iife',
    name: 'MyBundle',
  },
  plugins: [typescript(), commonjs(), resolve(), css()],
  watch: {
    clearScreen: false,
    include: 'src/**',
    exclude: 'node_modules/**',
  },
};
