import { Unary } from './unary';
import { Binary } from './binary';
import { Grouping } from './grouping';
import { Literal } from './literal';

export interface ExpressionVisitor<R> {
  visitUnaryExpression: (expression: Unary) => R;
  visitBinaryExpression: (expression: Binary) => R;
  visitGroupingExpression: (expression: Grouping) => R;
  visitLiteralExpression: (expression: Literal) => R;
}
