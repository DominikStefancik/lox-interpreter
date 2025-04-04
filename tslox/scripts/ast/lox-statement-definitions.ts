import { AstNodeType } from './models';

export const statementTypes: AstNodeType[] = [
  {
    filename: 'expression-statement',
    className: 'ExpressionStatement',
    fields: [
      {
        name: 'expression',
        type: 'Expression',
      },
    ],
    imports: [
      `import { Expression } from '@local/ast/expressions/expression';`,
      `import { Statement } from './statement';`,
      `import { StatementVisitor } from './statement-visitor';`,
    ],
  },
  {
    filename: 'print',
    className: 'Print',
    fields: [
      {
        name: 'expression',
        type: 'Expression',
      },
    ],
    imports: [
      `import { Expression } from '@local/ast/expressions/expression';`,
      `import { Statement } from './statement';`,
      `import { StatementVisitor } from './statement-visitor';`,
    ],
  },
  {
    filename: 'variable-declaration',
    className: 'VariableDeclaration',
    fields: [
      {
        name: 'name',
        type: 'Token',
      },
      {
        name: 'initializer',
        type: 'Expression',
        isOptional: true,
      },
    ],
    imports: [
      `import { Expression } from '@local/ast/expressions/expression';`,
      `import { Statement } from './statement';`,
      `import { StatementVisitor } from './statement-visitor';`,
      `import { Token } from '@local/scanning/token';`,
    ],
  },
];
