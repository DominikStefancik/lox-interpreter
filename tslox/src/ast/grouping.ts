import { Expression } from './expression';
import { ExpressionVisitor } from './expression-visitor';

export class Grouping extends Expression {
  constructor(public readonly expression: Expression) {
    super();
  }

  public accept<R>(visitor: ExpressionVisitor<R>): R {
    return visitor.visitGroupingExpression(this);
  }
}
