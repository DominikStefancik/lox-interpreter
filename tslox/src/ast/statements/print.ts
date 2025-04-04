import { Statement } from './statement';
import { StatementVisitor } from './statement-visitor';

export class Print extends Statement {
  constructor(public readonly statement: Statement) {
    super();
  }

  public accept<R>(visitor: StatementVisitor<R>): R {
    return visitor.visitPrintStatement(this);
  }
}
