import { eslintNextTs } from 'ewelint'
import tailwind from 'eslint-plugin-tailwindcss'

export default [
  ...eslintNextTs,
  ...tailwind.configs["flat/recommended"],
  {
    rules: {
      'no-unsafe-optional-chaining': 'off',
      'no-unused-vars': 'off',
      'tailwindcss/no-custom-classname': 'off'
    }
  }
]