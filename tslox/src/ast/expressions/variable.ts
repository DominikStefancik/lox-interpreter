import { Expression } from './expression';
import { ExpressionVisitor } from './expression-visitor';
import { Token } from '@local/scanning/token';

export class Variable extends Expression {
  constructor(public readonly name: Token) {
    super();
  }

  public accept<R>(visitor: ExpressionVisitor<R>): R {
    return visitor.visitVariableExpression(this);
  }
}
