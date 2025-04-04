import { Expression } from '@local/ast/expressions/expression';
import { Statement } from './statement';
import { StatementVisitor } from './statement-visitor';
import { Token } from '@local/scanning/token';

export class VariableDeclaration extends Statement {
  constructor(
    public readonly name: Token,
    public readonly initializer?: Expression
  ) {
    super();
  }

  public accept<R>(visitor: StatementVisitor<R>): R {
    return visitor.visitVariableDeclarationStatement(this);
  }
}
