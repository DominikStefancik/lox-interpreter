import { Expression } from './expressions/expression';
import { ExpressionVisitor } from './expressions/expression-visitor';
import { Unary } from '@local/ast/expressions/unary';
import { Binary } from '@local/ast/expressions/binary';
import { Grouping } from '@local/ast/expressions/grouping';
import { Literal } from '@local/ast/expressions/literal';
import { Variable } from '@local/ast/expressions/variable';
import { Assignment } from '@local/ast/expressions/assignment';

export class AstPrinter implements ExpressionVisitor<string> {
  public print(expression: Expression): string {
    return expression.accept(this);
  }

  public visitUnaryExpression(expression: Unary): string {
    return this.parenthesize(expression.operator.getLexeme(), [expression.right]);
  }

  public visitBinaryExpression(expression: Binary): string {
    return this.parenthesize(expression.operator.getLexeme(), [expression.left, expression.right]);
  }

  public visitGroupingExpression(expression: Grouping): string {
    return this.parenthesize('group', [expression.expression]);
  }

  public visitLiteralExpression(expression: Literal): string {
    if (expression.value == null) return 'nil';

    return expression.value.toString();
  }

  visitVariableExpression(expression: Variable): string {
    return expression.name.toString();
  }

  visitAssignmentExpression(expression: Assignment): string {
    return this.parenthesize(expression.name.getLexeme(), [expression.value]);
  }

  private parenthesize(name: string, expressions: Expression[]): string {
    let result = '(';
    result += name;

    for (const expression of expressions) {
      result += ` ${expression.accept(this)}`;
    }

    result += ')';

    return result;
  }
}
