// import 'module-alias/register';
//
// import { expect } from 'chai';
// import { Token } from '@local/scanning/token';
// import { TokenType } from '@local/scanning/token-type';
// import { Binary } from '@local/ast/expressions/binary';
// import { Literal } from '@local/ast/expressions/literal';
// import { Grouping } from '@local/ast/expressions/grouping';
// import { Unary } from '@local/ast/expressions/unary';
// import { Lox } from '../../src/lox';
// import { ExpressionStatement } from '@local/ast/statements/expression-statement';
//
// describe('Interpreter', () => {
//   const sut = Lox.interpreter;
//
//   it('evaluates a simple number', () => {
//     // expression: 3
//     const expression = new ExpressionStatement(new Literal(3));
//     const result = sut.interpret([expression]);
//     expect(result).to.eql(3);
//   });
//
//   it('evaluates a simple unary expression', () => {
//     // expression: -3
//     const expression = new Unary(new Token(TokenType.MINUS, '-', null, 1), new Literal(3));
//
//     const result = sut.interpret(expression);
//     expect(result).to.eql(-3);
//   });
//
//   it('evaluates negation unary expression', () => {
//     // expression: !3
//     let expression = new Unary(new Token(TokenType.BANG, '!', null, 1), new Literal(3));
//
//     let result = sut.interpret(expression);
//     expect(result).to.eql(false);
//
//     // expression: !false
//     expression = new Unary(new Token(TokenType.BANG, '!', null, 1), new Literal(false));
//
//     result = sut.interpret(expression);
//     expect(result).to.eql(true);
//   });
//
//   it('evaluates a simple binary expression', () => {
//     // expression: 3 + 1
//     const expression = new Binary(
//       new Literal(3),
//       new Token(TokenType.PLUS, '+', null, 1),
//       new Literal(1)
//     );
//
//     const result = sut.interpret(expression);
//     expect(result).to.eql(4);
//   });
//
//   it('evaluates equality binary expression', () => {
//     // expression: 3 == 3
//     let expression = new Binary(
//       new Literal(3),
//       new Token(TokenType.EQUAL_EQUAL, '==', null, 1),
//       new Literal(3)
//     );
//
//     let result = sut.interpret(expression);
//     expect(result).to.eql(true);
//
//     // expression: 3 != 3
//     expression = new Binary(
//       new Literal(3),
//       new Token(TokenType.BANG_EQUAL, '!=', null, 1),
//       new Literal(3)
//     );
//
//     result = sut.interpret(expression);
//     expect(result).to.eql(false);
//
//     // expression: false == true
//     expression = new Binary(
//       new Literal(false),
//       new Token(TokenType.EQUAL_EQUAL, '==', null, 1),
//       new Literal(true)
//     );
//
//     result = sut.interpret(expression);
//     expect(result).to.eql(false);
//   });
//
//   it('evaluates an expression with two operators and correct precedence', () => {
//     // expression: 8 / 2 + 1
//     const left = new Binary(
//       new Literal(8),
//       new Token(TokenType.SLASH, '/', null, 1),
//       new Literal(2)
//     );
//     const expression = new Binary(left, new Token(TokenType.PLUS, '+', null, 1), new Literal(1));
//
//     const result = sut.interpret(expression);
//     expect(result).to.eql(5);
//   });
//
//   it('evaluates an expression with multiple operators', () => {
//     // expression: 12 / 2 + 1 >= 10 - 3 * 4
//
//     const left = new Binary(
//       new Literal(12),
//       new Token(TokenType.SLASH, '/', null, 1),
//       new Literal(2)
//     );
//     const outerLeft = new Binary(left, new Token(TokenType.PLUS, '+', null, 1), new Literal(1));
//
//     const right = new Binary(
//       new Literal(3),
//       new Token(TokenType.STAR, '*', null, 1),
//       new Literal(4)
//     );
//     const outerRight = new Binary(new Literal(10), new Token(TokenType.MINUS, '-', null, 1), right);
//
//     const expression = new Binary(
//       outerLeft,
//       new Token(TokenType.GREATER_EQUAL, '>=', null, 1),
//       outerRight
//     );
//
//     const result = sut.interpret(expression);
//     expect(result).to.eql(true);
//   });
//
//   it('evaluates a binary expression with plus operator and two strings', () => {
//     // expression: 'hello' + 'World'
//     const expression = new Binary(
//       new Literal('hello'),
//       new Token(TokenType.PLUS, '+', null, 1),
//       new Literal('World')
//     );
//
//     const result = sut.interpret(expression);
//     expect(result).to.eql('helloWorld');
//   });
//
//   it('evaluates a binary expression with plus operator and string and number as operands', () => {
//     // expression: 'hello' + 55
//     let expression = new Binary(
//       new Literal('hello'),
//       new Token(TokenType.PLUS, '+', null, 1),
//       new Literal(55)
//     );
//
//     let result = sut.interpret(expression);
//     expect(result).to.eql('hello55');
//
//     // expression: 'hello' + 55 + 'World'
//     expression = new Binary(
//       new Literal(55),
//       new Token(TokenType.PLUS, '+', null, 1),
//       new Literal('World')
//     );
//
//     result = sut.interpret(expression);
//     expect(result).to.eql('55World');
//   });
//
//   it('evaluates an expression with grouping', () => {
//     // expression: (15 * 2)
//     const subExpression = new Binary(
//       new Literal(15),
//       new Token(TokenType.STAR, '*', null, 1),
//       new Literal(2)
//     );
//     const expression = new Grouping(subExpression);
//     const result = sut.interpret(expression);
//     expect(result).to.eql(30);
//   });
//
//   it('reports runtime error when a unary value is not number', () => {
//     // expression: -'muffin'
//     const expression = new Unary(new Token(TokenType.MINUS, '-', null, 1), new Literal('muffin'));
//
//     sut.interpret(expression);
//
//     expect(Lox.hadRuntimeError).to.be.equal(true);
//   });
//
//   it('reports runtime error when one of binary values is not number or string', () => {
//     // expression:  false + 2
//     const expression = new Binary(
//       new Literal(false),
//       new Token(TokenType.PLUS, '+', null, 1),
//       new Literal(2)
//     );
//
//     sut.interpret(expression);
//
//     expect(Lox.hadRuntimeError).to.be.equal(true);
//   });
// });
