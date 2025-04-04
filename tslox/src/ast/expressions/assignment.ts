import { Expression } from '@local/ast/expressions/expression';
import { ExpressionVisitor } from './expression-visitor';
import { Token } from '@local/scanning/token';

export class Assignment extends Expression {
  constructor(
    public readonly name: Token,
    public readonly value: Expression
  ) {
    super();
  }

  public accept<R>(visitor: ExpressionVisitor<R>): R {
    return visitor.visitAssignmentExpression(this);
  }
}
