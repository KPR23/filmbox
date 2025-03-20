import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    plugins: {
      '@next/next': await import('@next/eslint-plugin-next').then(
        (m) => m.default
      ),
      'react-hooks': await import('eslint-plugin-react-hooks').then(
        (m) => m.default
      ),
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error', // Enforce Rules of Hooks
      'react-hooks/exhaustive-deps': 'warn', // Enforce exhaustive dependency arrays
    },
  },
];

export default eslintConfig;
