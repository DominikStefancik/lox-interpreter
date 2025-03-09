import { Expression } from './expression';
import { ExpressionVisitor } from './expression-visitor';
import { Token } from '../scanning/token';

export class Unary extends Expression {
  constructor(
    public readonly operator: Token,
    public readonly right: Expression
  ) {
    super();
  }

  public accept<R>(visitor: ExpressionVisitor<R>): R {
    return visitor.visitUnaryExpression(this);
  }
}
