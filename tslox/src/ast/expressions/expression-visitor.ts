import { Unary } from './unary';
import { Binary } from './binary';
import { Grouping } from './grouping';
import { Literal } from './literal';
import { Variable } from './variable';
import { Assignment } from './assignment';

export interface ExpressionVisitor<R> {
  visitUnaryExpression: (expression: Unary) => R;
  visitBinaryExpression: (expression: Binary) => R;
  visitGroupingExpression: (expression: Grouping) => R;
  visitLiteralExpression: (expression: Literal) => R;
  visitVariableExpression: (expression: Variable) => R;
  visitAssignmentExpression: (expression: Assignment) => R;
}
