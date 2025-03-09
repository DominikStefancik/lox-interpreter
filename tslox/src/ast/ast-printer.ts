import { Expression } from './expression';
import { ExpressionVisitor } from './expression-visitor';
import { Unary } from './unary';
import { Binary } from './binary';
import { Grouping } from './grouping';
import { Literal } from './literal';

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
