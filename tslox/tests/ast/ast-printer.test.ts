import 'module-alias/register';

import { expect } from 'chai';
import { Unary } from '../../src/ast/unary';
import { Token } from '@local/scanning/token';
import { TokenType } from '@local/scanning/token-type';
import { Literal } from '../../src/ast/literal';
import { AstPrinter } from '../../src/ast/ast-printer';
import { Binary } from '../../src/ast/binary';
import { Grouping } from '../../src/ast/grouping';

describe('AstPrinter', () => {
  it('prints unary expression', () => {
    const sut = new AstPrinter();
    const expression = new Unary(new Token(TokenType.MINUS, '-', null, 1), new Literal(1));
    const result = sut.print(expression);

    expect(result).to.be.equal('(- 1)');
  });

  it('prints binary expression', () => {
    const sut = new AstPrinter();
    const expression = new Binary(
      new Literal(1),
      new Token(TokenType.PLUS, '+', null, 1),
      new Literal(2)
    );
    const result = sut.print(expression);

    expect(result).to.be.equal('(+ 1 2)');
  });

  it('prints group expression', () => {
    const sut = new AstPrinter();
    const expression = new Binary(
      new Unary(new Token(TokenType.MINUS, '-', null, 1), new Literal(123)),
      new Token(TokenType.STAR, '*', null, 1),
      new Grouping(new Literal(45.67))
    );
    const result = sut.print(expression);

    expect(result).to.be.equal('(* (- 123) (group 45.67))');
  });
});
