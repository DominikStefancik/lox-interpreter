import 'module-alias/register';

import { expect } from 'chai';
import { Token } from '@local/scanning/token';
import { TokenType } from '@local/scanning/token-type';
import { Parser } from '@local/parsing/parser';
import { Binary } from '@local/ast/expressions/binary';
import { Literal } from '@local/ast/expressions/literal';
import { Unary } from '@local/ast/expressions/unary';
import { Grouping } from '@local/ast/expressions/grouping';
import { ExpressionStatement } from '@local/ast/statements/expression-statement';
import { Assignment } from '@local/ast/expressions/assignment';

describe('Parser - Expressions', () => {
  it('parses a simple unary expression', () => {
    // expression: -3
    const tokens = [
      new Token(TokenType.MINUS, '-', null, 1),
      new Token(TokenType.NUMBER, '3', 3, 1),
      new Token(TokenType.SEMICOLON, ';', null, 1),
      new Token(TokenType.EOF, '', null, 1),
    ];
    const sut = new Parser(tokens);
    const statements = sut.parse();
    const expression = (statements[0] as ExpressionStatement).expression;

    expect(expression).to.not.equal(null);
    expect(expression instanceof Unary).to.be.equal(true);

    const unary = expression as Unary;
    expect(unary.operator).to.eql(new Token(TokenType.MINUS, '-', null, 1));
    expect(unary.right).to.eql(new Literal(3));
  });

  it('parses a simple binary expression', () => {
    // expression: 3 + 1
    const tokens = [
      new Token(TokenType.NUMBER, '3', 3, 1),
      new Token(TokenType.PLUS, '+', null, 1),
      new Token(TokenType.NUMBER, '1', 1, 1),
      new Token(TokenType.SEMICOLON, ';', null, 1),
      new Token(TokenType.EOF, '', null, 1),
    ];
    const sut = new Parser(tokens);
    const statements = sut.parse();
    const expression = (statements[0] as ExpressionStatement).expression;

    expect(expression).to.not.equal(null);
    expect(expression instanceof Binary).to.be.equal(true);

    const binary = expression as Binary;
    expect(binary.left).to.eql(new Literal(3));
    expect(binary.operator).to.eql(new Token(TokenType.PLUS, '+', null, 1));
    expect(binary.right).to.eql(new Literal(1));
  });

  it('parses an expression with two operators and correct precedence', () => {
    // expression: 6 / 2 + 1
    const tokens = [
      new Token(TokenType.NUMBER, '6', 6, 1),
      new Token(TokenType.SLASH, '/', null, 1),
      new Token(TokenType.NUMBER, '2', 2, 1),
      new Token(TokenType.PLUS, '+', null, 1),
      new Token(TokenType.NUMBER, '1', 1, 1),
      new Token(TokenType.SEMICOLON, ';', null, 1),
      new Token(TokenType.EOF, '', null, 1),
    ];
    const sut = new Parser(tokens);
    const statements = sut.parse();
    const expression = (statements[0] as ExpressionStatement).expression;

    expect(expression).to.not.equal(null);
    expect(expression instanceof Binary).to.be.equal(true);

    const binary = expression as Binary;
    expect(binary.left instanceof Binary).to.be.equal(true);

    const left = binary.left as Binary;
    expect(left.left).to.eql(new Literal(6));
    expect(left.operator).to.eql(new Token(TokenType.SLASH, '/', null, 1));
    expect(left.right).to.eql(new Literal(2));

    expect(binary.operator).to.eql(new Token(TokenType.PLUS, '+', null, 1));
    expect(binary.right).to.eql(new Literal(1));
  });

  it('parses an expression with multiple operators', () => {
    // expression: a / 2 + 1 >= b * c - 5
    const tokens = [
      new Token(TokenType.STRING, 'a', 'a', 1),
      new Token(TokenType.SLASH, '/', null, 1),
      new Token(TokenType.NUMBER, '2', 2, 1),
      new Token(TokenType.PLUS, '+', null, 1),
      new Token(TokenType.NUMBER, '1', 1, 1),
      new Token(TokenType.GREATER_EQUAL, '>=', null, 1),
      new Token(TokenType.STRING, 'b', 'b', 1),
      new Token(TokenType.STAR, '*', null, 1),
      new Token(TokenType.STRING, 'c', 'c', 1),
      new Token(TokenType.MINUS, '-', null, 1),
      new Token(TokenType.NUMBER, '5', 5, 1),
      new Token(TokenType.SEMICOLON, ';', null, 1),
      new Token(TokenType.EOF, '', null, 1),
    ];
    const sut = new Parser(tokens);
    const statements = sut.parse();
    const expression = (statements[0] as ExpressionStatement).expression;

    expect(expression).to.not.equal(null);
    expect(expression instanceof Binary).to.be.equal(true);

    const binary = expression as Binary;
    expect(binary.operator).to.eql(new Token(TokenType.GREATER_EQUAL, '>=', null, 1));
    expect(binary.left instanceof Binary).to.be.equal(true);
    expect(binary.right instanceof Binary).to.be.equal(true);

    ////////////////////////////////////////////////////////////////////////////////////
    const comparisonLeft = binary.left as Binary; // comparisonLeft: a / 2 + 1
    expect(comparisonLeft.left instanceof Binary).to.be.equal(true);

    let left = comparisonLeft.left as Binary; // left: a / 2
    expect(left.left).to.eql(new Literal('a'));
    expect(left.operator).to.eql(new Token(TokenType.SLASH, '/', null, 1));
    expect(left.right).to.eql(new Literal(2));
    expect(comparisonLeft.operator).to.eql(new Token(TokenType.PLUS, '+', null, 1));
    expect(comparisonLeft.right).to.eql(new Literal(1));

    ////////////////////////////////////////////////////////////////////////////////////
    const comparisonRight = binary.right as Binary; // comparisonRight: b * c - 5
    expect(comparisonRight.left instanceof Binary).to.be.equal(true);

    left = comparisonRight.left as Binary; // left: b * c
    expect(left.left).to.eql(new Literal('b'));
    expect(left.operator).to.eql(new Token(TokenType.STAR, '*', null, 1));
    expect(left.right).to.eql(new Literal('c'));
    expect(comparisonRight.operator).to.eql(new Token(TokenType.MINUS, '-', null, 1));
    expect(comparisonRight.right).to.eql(new Literal(5));
  });

  it('parses an expression with grouping', () => {
    // expression: (6 / 2)
    const tokens = [
      new Token(TokenType.LEFT_PARENTHESES, '(', null, 1),
      new Token(TokenType.NUMBER, '6', 6, 1),
      new Token(TokenType.SLASH, '/', null, 1),
      new Token(TokenType.NUMBER, '2', 2, 1),
      new Token(TokenType.RIGHT_PARENTHESES, ')', null, 1),
      new Token(TokenType.SEMICOLON, ';', null, 1),
      new Token(TokenType.EOF, '', null, 1),
    ];
    const sut = new Parser(tokens);
    const statements = sut.parse();
    const expression = (statements[0] as ExpressionStatement).expression;

    expect(expression).to.not.equal(null);
    expect(expression instanceof Grouping).to.be.equal(true);

    const grouping = expression as Grouping;
    expect(grouping.expression instanceof Binary).to.be.equal(true);

    const innerExpression = grouping.expression as Binary;
    expect(innerExpression.left).to.eql(new Literal(6));
    expect(innerExpression.operator).to.eql(new Token(TokenType.SLASH, '/', null, 1));
    expect(innerExpression.right).to.eql(new Literal(2));
  });

  it('parses an expression with assignment', () => {
    // expression: result = a + 10;
    const tokens = [
      new Token(TokenType.IDENTIFIER, 'result', null, 1),
      new Token(TokenType.EQUAL, '=', null, 1),
      new Token(TokenType.STRING, 'a', 'a', 1),
      new Token(TokenType.PLUS, '+', null, 1),
      new Token(TokenType.NUMBER, '10', 10, 1),
      new Token(TokenType.SEMICOLON, ';', null, 1),
      new Token(TokenType.EOF, '', null, 1),
    ];
    const sut = new Parser(tokens);
    const statements = sut.parse();
    const expression = (statements[0] as ExpressionStatement).expression;

    expect(expression).to.not.equal(null);
    expect(expression instanceof Assignment).to.be.equal(true);

    const assignment = expression as Assignment;
    expect(assignment.name).to.eql(new Token(TokenType.IDENTIFIER, 'result', null, 1));
    expect(assignment.value instanceof Binary).to.be.equal(true);

    const value = assignment.value as Binary;
    expect(value.left).to.eql(new Literal('a'));
    expect(value.operator).to.eql(new Token(TokenType.PLUS, '+', null, 1));
    expect(value.right).to.eql(new Literal(10));
  });

  it('returns statements array with null when grouping is missing right parentheses', () => {
    // expression: (6 / 2
    const tokens = [
      new Token(TokenType.LEFT_PARENTHESES, '(', null, 1),
      new Token(TokenType.NUMBER, '6', 6, 1),
      new Token(TokenType.SLASH, '/', null, 1),
      new Token(TokenType.NUMBER, '2', 2, 1),
      new Token(TokenType.EOF, '', null, 1),
    ];
    const sut = new Parser(tokens);
    const statements = sut.parse();

    expect(statements[0]).to.be.equal(null);
  });

  it('returns statements array with null when expression is incorrect', () => {
    // expression:  a ==
    const tokens = [
      new Token(TokenType.STRING, 'a', 'a', 1),
      new Token(TokenType.EQUAL_EQUAL, '==', null, 1),
      new Token(TokenType.EOF, '', null, 1),
    ];
    const sut = new Parser(tokens);
    const statements = sut.parse();

    expect(statements[0]).to.be.equal(null);
  });

  it('returns statements array with only left side when assignment expression is incorrect', () => {
    // expression:  a + 1 = b + 3;
    const tokens = [
      new Token(TokenType.STRING, 'a', 'a', 1),
      new Token(TokenType.PLUS, '+', null, 1),
      new Token(TokenType.NUMBER, '1', 1, 1),
      new Token(TokenType.EQUAL, '=', null, 1),
      new Token(TokenType.STRING, 'b', 'b', 1),
      new Token(TokenType.STAR, '*', null, 1),
      new Token(TokenType.NUMBER, '3', 3, 1),
      new Token(TokenType.SEMICOLON, ';', null, 1),
      new Token(TokenType.EOF, '', null, 1),
    ];
    const sut = new Parser(tokens);
    const statements = sut.parse();

    expect(statements.length).to.be.equal(1);
  });
});
