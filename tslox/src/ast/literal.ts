import { Expression } from './expression';
import { ExpressionVisitor } from './expression-visitor';

export class Literal extends Expression {
  constructor(private readonly value: object) {
    super();
  }

  public accept(visitor: ExpressionVisitor): Expression {
    return visitor.visitLiteralExpression(this);
  }
}
