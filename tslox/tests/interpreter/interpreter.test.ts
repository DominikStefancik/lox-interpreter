import 'module-alias/register';

import { expect } from 'chai';
import { Token } from '@local/scanning/token';
import { TokenType } from '@local/scanning/token-type';
import { Binary } from '@local/ast/binary';
import { Literal } from '@local/ast/literal';
import { Grouping } from '@local/ast/grouping';
import { Unary } from '@local/ast/unary';
import { Lox } from '../../src/lox';

describe('Interpreter', () => {
  const sut = Lox.interpreter;

  it('evaluates a simple number', () => {
    // expression: 3
    const expression = new Literal(3);
    const result = sut.interpret(expression);
    expect(result).to.eql(3);
  });

  it('evaluates a simple unary expression', () => {
    // expression: -3
    const expression = new Unary(new Token(TokenType.MINUS, '-', null, 1), new Literal(3));

    const result = sut.interpret(expression);
    expect(result).to.eql(-3);
  });

  it('evaluates a simple binary expression', () => {
    // expression: 3 + 1
    const expression = new Binary(
      new Literal(3),
      new Token(TokenType.PLUS, '+', null, 1),
      new Literal(1)
    );

    const result = sut.interpret(expression);
    expect(result).to.eql(4);
  });

  it('evaluates an expression with two operators and correct precedence', () => {
    // expression: 8 / 2 + 1
    const left = new Binary(
      new Literal(8),
      new Token(TokenType.SLASH, '/', null, 1),
      new Literal(2)
    );
    const expression = new Binary(left, new Token(TokenType.PLUS, '+', null, 1), new Literal(1));

    const result = sut.interpret(expression);
    expect(result).to.eql(5);
  });

  it('evaluates an expression with multiple operators', () => {
    // expression: 12 / 2 + 1 >= 10 - 3 * 4

    const left = new Binary(
      new Literal(12),
      new Token(TokenType.SLASH, '/', null, 1),
      new Literal(2)
    );
    const outerLeft = new Binary(left, new Token(TokenType.PLUS, '+', null, 1), new Literal(1));

    const right = new Binary(
      new Literal(3),
      new Token(TokenType.STAR, '*', null, 1),
      new Literal(4)
    );
    const outerRight = new Binary(new Literal(10), new Token(TokenType.MINUS, '-', null, 1), right);

    const expression = new Binary(
      outerLeft,
      new Token(TokenType.GREATER_EQUAL, '>=', null, 1),
      outerRight
    );

    const result = sut.interpret(expression);
    expect(result).to.eql(true);
  });

  it('evaluates an expression with grouping', () => {
    // expression: (15 * 2)
    const subExpression = new Binary(
      new Literal(15),
      new Token(TokenType.STAR, '*', null, 1),
      new Literal(2)
    );
    const expression = new Grouping(subExpression);
    const result = sut.interpret(expression);
    expect(result).to.eql(30);
  });

  it('returns null and reports error when grouping is missing right parentheses', () => {
    // expression: (6 / 2
  });

  it('returns null and reports error when expression is incorrect', () => {
    // expression:  a ==
  });
});
