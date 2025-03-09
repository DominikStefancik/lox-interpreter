import { Expression } from './expression';
import { Unary } from './unary';
import { Binary } from './binary';
import { Grouping } from './grouping';
import { Literal } from './literal';

export interface ExpressionVisitor {
  visitUnaryExpression: (expression: Unary) => Expression;
  visitBinaryExpression: (expression: Binary) => Expression;
  visitGroupingExpression: (expression: Grouping) => Expression;
  visitLiteralExpression: (expression: Literal) => Expression;
}
