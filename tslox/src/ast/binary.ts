import { Expression } from './expression';
import { ExpressionVisitor } from './expression-visitor';
import { Token } from '../scanning/token';

export class Binary extends Expression {
  constructor(
    private readonly left: Expression,
    private readonly operator: Token,
    private readonly right: Expression
  ) {
    super();
  }

  public accept(visitor: ExpressionVisitor): Expression {
    return visitor.visitBinaryExpression(this);
  }
}
