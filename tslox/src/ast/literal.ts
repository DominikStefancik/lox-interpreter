import { Expression } from './expression';
import { ExpressionVisitor } from './expression-visitor';

export class Literal extends Expression {
  constructor(public readonly value: any) {
    super();
  }

  public accept<R>(visitor: ExpressionVisitor<R>): R {
    return visitor.visitLiteralExpression(this);
  }
}
