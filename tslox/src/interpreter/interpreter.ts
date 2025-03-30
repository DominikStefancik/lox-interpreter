import { ExpressionVisitor } from '@local/ast/expression-visitor';
import { Binary } from '@local/ast/binary';
import { Grouping } from '@local/ast/grouping';
import { Literal } from '@local/ast/literal';
import { Unary } from '@local/ast/unary';
import { Expression } from '@local/ast/expression';
import { TokenType } from '@local/scanning/token-type';

export class Interpreter implements ExpressionVisitor<object> {
  visitUnaryExpression(expression: Unary): object {
    /**
     * Unary expressions have a single subexpression that we must evaluate first.
     * First, the operand expression is evaluated. Then the unary operator itself is applied to the result of that.
     */

    const right = this.evaluate(expression.right);

    switch (expression.operator.getType()) {
      case TokenType.MINUS:
        return -(right as unknown as number) as unknown as object;
      case TokenType.BANG:
        return !this.isTruthy(right) as unknown as object;
    }

    return null;
  }

  visitBinaryExpression(expression: Binary): object {
    const left = this.evaluate(expression.left);
    const right = this.evaluate(expression.right);

    switch (expression.operator.getType()) {
      case TokenType.EQUAL_EQUAL:
        return this.isEqual(left, right) as unknown as object;
      case TokenType.BANG_EQUAL:
        return !this.isEqual(left, right) as unknown as object;
      case TokenType.GREATER:
        return ((left as unknown as number) > (right as unknown as number)) as unknown as object;
      case TokenType.GREATER_EQUAL:
        return ((left as unknown as number) >= (right as unknown as number)) as unknown as object;
      case TokenType.LESS:
        return ((left as unknown as number) < (right as unknown as number)) as unknown as object;
      case TokenType.LESS_EQUAL:
        return ((left as unknown as number) <= (right as unknown as number)) as unknown as object;
      case TokenType.PLUS:
        if (left instanceof Number && right instanceof Number) {
          return ((left as unknown as number) + (right as unknown as number)) as unknown as object;
        }

        if (left instanceof String && right instanceof String) {
          return ((left as unknown as string) + (right as unknown as string)) as unknown as object;
        }

        break;
      case TokenType.MINUS:
        return ((left as unknown as number) - (right as unknown as number)) as unknown as object;
      case TokenType.SLASH:
        return ((left as unknown as number) / (right as unknown as number)) as unknown as object;
      case TokenType.STAR:
        return ((left as unknown as number) * (right as unknown as number)) as unknown as object;
    }

    return null;
  }

  visitGroupingExpression(expression: Grouping): object {
    /**
     * A grouping node has a reference to an inner node for the expression contained inside the parentheses.
     * To evaluate the grouping expression itself, the subexpression is recursively evaluated and returned.
     */

    return this.evaluate(expression);
  }

  visitLiteralExpression(expression: Literal): object {
    /**
     * A literal is a bit of syntax that produces a value. A literal always appears somewhere in the user’s source code.
     * Lots of values are produced by computation and don’t exist anywhere in the code itself. Those aren’t literals.
     */

    return expression.value as unknown as object;
  }

  private evaluate(expression: Expression): object {
    return expression.accept(this);
  }

  private isTruthy(object: object): boolean {
    if (object == null) {
      return false;
    }

    if (object instanceof Boolean) {
      return object as boolean;
    }

    return true;
  }

  private isEqual(objectA: object, objectB: object): boolean {
    if (objectA === null && objectB === null) {
      return true;
    }

    if (objectA === null || objectB === null) {
      return false;
    }

    return objectA === objectB;
  }
}
