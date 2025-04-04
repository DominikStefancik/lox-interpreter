import { AstNodeType } from './generate-ast-classes';

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
];
