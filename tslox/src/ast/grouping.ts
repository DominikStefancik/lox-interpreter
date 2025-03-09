import { Expression } from './expression';
import { ExpressionVisitor } from './expression-visitor';

export class Grouping extends Expression {
  constructor(private readonly expression: Expression) {
    super();
  }

  public accept(visitor: ExpressionVisitor): Expression {
    return visitor.visitGroupingExpression(this);
  }
}
