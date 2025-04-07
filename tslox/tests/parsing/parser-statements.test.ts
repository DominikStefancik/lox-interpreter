import 'module-alias/register';

import { expect } from 'chai';
import { Token } from '@local/scanning/token';
import { TokenType } from '@local/scanning/token-type';
import { Parser } from '@local/parsing/parser';
import { ExpressionStatement } from '@local/ast/statements/expression-statement';
import { Print } from '@local/ast/statements/print';
import { Block } from '@local/ast/statements/block';
import { Assignment } from '@local/ast/expressions/assignment';
import { Binary } from '@local/ast/expressions/binary';

describe('Parser - Statements', () => {
  it('parses a simple expression statement', () => {
    // expression statement: 3 + 1
    const tokens = [
      new Token(TokenType.NUMBER, '3', 3, 1),
      new Token(TokenType.PLUS, '+', null, 1),
      new Token(TokenType.NUMBER, '1', 1, 1),
      new Token(TokenType.SEMICOLON, ';', null, 1),
      new Token(TokenType.EOF, '', null, 1),
    ];
    const sut = new Parser(tokens);
    const statements = sut.parse();

    expect(statements.length).to.be.equal(1);
    expect(statements[0] instanceof ExpressionStatement).to.be.equal(true);
  });

  it('parses a print statement', () => {
    // statement: print 6 / 2;
    const tokens = [
      new Token(TokenType.PRINT, 'print', null, 1),
      new Token(TokenType.NUMBER, '6', 6, 1),
      new Token(TokenType.SLASH, '/', null, 1),
      new Token(TokenType.NUMBER, '2', 2, 1),
      new Token(TokenType.SEMICOLON, ';', null, 1),
      new Token(TokenType.EOF, '', null, 1),
    ];
    const sut = new Parser(tokens);
    const statements = sut.parse();

    expect(statements.length).to.be.equal(1);
    expect(statements[0] instanceof Print).to.be.equal(true);
  });

  it('parses a block of statements', () => {
    // block: { result = a + 10; 6 / 2; result = result * 10;  }
    const tokens = [
      new Token(TokenType.LEFT_CURLY_BRACE, '{', null, 1),
      ///////////////////////////////////////////////////////
      new Token(TokenType.IDENTIFIER, 'result', null, 1),
      new Token(TokenType.EQUAL, '=', null, 1),
      new Token(TokenType.STRING, 'a', 'a', 1),
      new Token(TokenType.PLUS, '+', null, 1),
      new Token(TokenType.NUMBER, '10', 10, 1),
      new Token(TokenType.SEMICOLON, ';', null, 1),
      ///////////////////////////////////////////////////////
      new Token(TokenType.NUMBER, '6', 6, 1),
      new Token(TokenType.SLASH, '/', null, 1),
      new Token(TokenType.NUMBER, '2', 2, 1),
      new Token(TokenType.SEMICOLON, ';', null, 1),
      ///////////////////////////////////////////////////////
      new Token(TokenType.IDENTIFIER, 'result', null, 1),
      new Token(TokenType.EQUAL, '=', null, 1),
      new Token(TokenType.STRING, 'result', 'result', 1),
      new Token(TokenType.STAR, '*', null, 1),
      new Token(TokenType.NUMBER, '10', 10, 1),
      new Token(TokenType.SEMICOLON, ';', null, 1),
      ///////////////////////////////////////////////////////
      new Token(TokenType.RIGHT_CURLY_BRACE, '}', null, 1),
      new Token(TokenType.EOF, '', null, 1),
    ];
    const sut = new Parser(tokens);
    const statements = sut.parse();

    expect(statements.length).to.be.equal(1);
    expect(statements[0] instanceof Block).to.be.equal(true);

    const block = statements[0] as Block;
    const blockStatements = block.statements;

    expect(blockStatements.length).to.be.equal(3);
    expect(blockStatements[0] instanceof ExpressionStatement).to.be.equal(true);
    expect(
      (blockStatements[0] as ExpressionStatement).expression instanceof Assignment
    ).to.be.equal(true);
    expect(blockStatements[1] instanceof ExpressionStatement).to.be.equal(true);
    expect((blockStatements[1] as ExpressionStatement).expression instanceof Binary).to.be.equal(
      true
    );
    expect(blockStatements[2] instanceof ExpressionStatement).to.be.equal(true);
    expect(
      (blockStatements[2] as ExpressionStatement).expression instanceof Assignment
    ).to.be.equal(true);
  });

  it('returns statements array with null when a block does not have a closing curly brace', () => {
    // block: { result = a + 10;
    const tokens = [
      new Token(TokenType.LEFT_CURLY_BRACE, '{', null, 1),
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

    expect(statements[0]).to.be.equal(null);
  });
});
