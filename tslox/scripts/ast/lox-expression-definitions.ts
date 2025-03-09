import { ExpressionType } from './generate-ast-classes';

export const expressionTypes: ExpressionType[] = [
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
      `import { Expression } from './expression';`,
      `import { Token } from '../scanning/token';`,
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
      `import { Token } from '../scanning/token';`,
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
    imports: [`import { Expression } from './expression';`],
  },
  {
    filename: 'literal',
    className: 'Literal',
    fields: [
      {
        name: 'value',
        type: 'object',
      },
    ],
    imports: [`import { Expression } from './expression';`],
  },
];
