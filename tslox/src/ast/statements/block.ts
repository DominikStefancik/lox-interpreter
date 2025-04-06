import { Statement } from './statement';
import { StatementVisitor } from './statement-visitor';

export class Block extends Statement {
  constructor(public readonly statements: Statement[]) {
    super();
  }

  public accept<R>(visitor: StatementVisitor<R>): R {
    return visitor.visitBlockStatement(this);
  }
}
