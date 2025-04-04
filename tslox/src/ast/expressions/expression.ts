import { ExpressionVisitor } from './expression-visitor';

export abstract class Expression {
  public abstract accept<R>(visitor: ExpressionVisitor<R>): R;
}
