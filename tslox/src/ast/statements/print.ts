import { Expression } from '@local/ast/expressions/expression';
import { Statement } from './statement';
import { StatementVisitor } from './statement-visitor';

export class Print extends Statement {
  constructor(public readonly expression: Expression) {
    super();
  }

  public accept<R>(visitor: StatementVisitor<R>): R {
    return visitor.visitPrintStatement(this);
  }
}
