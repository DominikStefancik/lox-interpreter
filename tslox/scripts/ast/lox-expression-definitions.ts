import { AstNodeType } from './generate-ast-classes';

export const expressionTypes: AstNodeType[] = [
  {
    filename: 'unary',
    className: 'Unary',
    fields: [
      {
        name: 'operator',
        type: 'Token',
      },
      {
        name: 'right',
        type: 'Expression',
      },
    ],
    imports: [
      `import { Expression } from '@local/ast/expressions/expression';`,
      `import { ExpressionVisitor } from './expression-visitor';`,
      `import { Token } from '@local/scanning/token';`,
    ],
  },
  {
    filename: 'binary',
    className: 'Binary',
    fields: [
      {
        name: 'left',
        type: 'Expression',
      },
      {
        name: 'operator',
        type: 'Token',
      },
      {
        name: 'right',
        type: 'Expression',
      },
    ],
    imports: [
      `import { Expression } from './expression';`,
      `import { ExpressionVisitor } from './expression-visitor';`,
      `import { Token } from '@local/scanning/token';`,
    ],
  },
  {
    filename: 'grouping',
    className: 'Grouping',
    fields: [
      {
        name: 'expression',
        type: 'Expression',
      },
    ],
    imports: [
      `import { Expression } from './expression';`,
      `import { ExpressionVisitor } from './expression-visitor';`,
    ],
  },
  {
    filename: 'literal',
    className: 'Literal',
    fields: [
      {
        name: 'value',
        type: `number | string | boolean | 'nil'`,
      },
    ],
    imports: [
      `import { Expression } from './expression';`,
      `import { ExpressionVisitor } from './expression-visitor';`,
    ],
  },
  {
    filename: 'variable',
    className: 'Variable',
    fields: [
      {
        name: 'name',
        type: 'Token',
      },
    ],
    imports: [
      `import { Expression } from './expression';`,
      `import { ExpressionVisitor } from './expression-visitor';`,
      `import { Token } from '@local/scanning/token';`,
    ],
  },
];
