import { AstNodeType } from './generate-ast-classes';

export const statementTypes: AstNodeType[] = [
  {
    filename: 'print',
    className: 'Print',
    fields: [
      {
        name: 'statement',
        type: 'Statement',
      },
    ],
    imports: [
      `import { Statement } from './statement';`,
      `import { StatementVisitor } from './statement-visitor';`,
    ],
  },
];
