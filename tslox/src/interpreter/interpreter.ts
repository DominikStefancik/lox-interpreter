import { ExpressionVisitor } from '@local/ast/expression-visitor';
import { Binary } from '@local/ast/binary';
import { Grouping } from '@local/ast/grouping';
import { Literal } from '@local/ast/literal';
import { Unary } from '@local/ast/unary';
import { Expression } from '@local/ast/expression';
import { TokenType } from '@local/scanning/token-type';
import { Token } from '@local/scanning/token';
import { RuntimeError } from '@local/interpreter/runtime-error';
import { Lox } from '../lox';

export class Interpreter implements ExpressionVisitor<object> {
  interpret(expression: Expression): object {
    try {
      const value = this.evaluate(expression);
      console.log(this.stringify(value));

      return value;
    } catch (error) {
      if (error instanceof RuntimeError) {
        Lox.runtimeError(error);
      }
    }
  }

  visitUnaryExpression(expression: Unary): object {
    /**
     * Unary expressions have a single subexpression that we must evaluate first.
     * First, the operand expression is evaluated. Then the unary operator itself is applied to the result of that.
     */

    const right = this.evaluate(expression.right);

    switch (expression.operator.getType()) {
      case TokenType.MINUS:
        this.checkSingleNumberOperand(expression.operator, right);
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
        this.checkNumberOperands(expression.operator, left, right);
        return ((left as unknown as number) > (right as unknown as number)) as unknown as object;
      case TokenType.GREATER_EQUAL:
        this.checkNumberOperands(expression.operator, left, right);
        return ((left as unknown as number) >= (right as unknown as number)) as unknown as object;
      case TokenType.LESS:
        this.checkNumberOperands(expression.operator, left, right);
        return ((left as unknown as number) < (right as unknown as number)) as unknown as object;
      case TokenType.LESS_EQUAL:
        this.checkNumberOperands(expression.operator, left, right);
        return ((left as unknown as number) <= (right as unknown as number)) as unknown as object;
      case TokenType.PLUS:
        if (typeof left === 'number' && typeof right === 'number') {
          return ((left as unknown as number) + (right as unknown as number)) as unknown as object;
        }

        if (typeof left === 'string' && typeof right === 'string') {
          return ((left as unknown as string) + (right as unknown as string)) as unknown as object;
        }

        if (typeof left === 'string' && typeof right === 'number') {
          return ((left as unknown as string) + (right as unknown as number)) as unknown as object;
        }

        if (typeof left === 'number' && typeof right === 'string') {
          return ((left as unknown as string) + (right as unknown as string)) as unknown as object;
        }

        throw new RuntimeError(expression.operator, 'Operands must be either numbers or strings');
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

    return this.evaluate(expression.expression);
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

    if (typeof object === 'boolean') {
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

  private checkSingleNumberOperand(operator: Token, operand: object) {
    if (typeof operand === 'number') {
      return;
    }

    throw new RuntimeError(operator, 'Operand must be a number');
  }

  private checkNumberOperands(operator: Token, left: object, right: object) {
    if (typeof left === 'number' && typeof right === 'number') {
      return;
    }

    throw new RuntimeError(operator, 'Operands must be a number');
  }

  private stringify(object: object) {
    if (object === null) return 'nil';

    if (object instanceof Number) {
      let text = `${object}`;

      if (text.endsWith('.0')) {
        text = text.substring(0, text.length - 2);
      }

      return text;
    }

    return `${object}`;
  }
}
