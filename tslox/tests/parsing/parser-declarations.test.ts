import 'module-alias/register';

import { expect } from 'chai';
import { Token } from '@local/scanning/token';
import { TokenType } from '@local/scanning/token-type';
import { Parser } from '@local/parsing/parser';
import { VariableDeclaration } from '@local/ast/statements/variable-declaration';
import { Binary } from '@local/ast/expressions/binary';

describe('Parser - Declarations', () => {
  it('parses a variable declaration without an assignment', () => {
    // declaration: var result;
    const tokens = [
      new Token(TokenType.VAR, 'var', null, 1),
      new Token(TokenType.IDENTIFIER, 'result', 'result', 1),
      new Token(TokenType.SEMICOLON, ';', null, 1),
      new Token(TokenType.EOF, '', null, 1),
    ];
    const sut = new Parser(tokens);
    const statements = sut.parse();

    expect(statements.length).to.be.equal(1);
    expect(statements[0] instanceof VariableDeclaration).to.be.equal(true);
    expect((statements[0] as VariableDeclaration).initializer).to.be.equal(undefined);
  });

  it('parses a variable declaration with an assignment', () => {
    // declaration: var result = a + 5;
    const tokens = [
      new Token(TokenType.VAR, 'var', null, 1),
      new Token(TokenType.IDENTIFIER, 'result', 'result', 1),
      new Token(TokenType.EQUAL, '=', null, 1),
      new Token(TokenType.STRING, 'a', 'a', 1),
      new Token(TokenType.PLUS, '+', null, 1),
      new Token(TokenType.NUMBER, '5', 5, 1),
      new Token(TokenType.SEMICOLON, ';', null, 1),
      new Token(TokenType.EOF, '', null, 1),
    ];
    const sut = new Parser(tokens);
    const statements = sut.parse();

    expect(statements.length).to.be.equal(1);
    expect(statements[0] instanceof VariableDeclaration).to.be.equal(true);
    expect((statements[0] as VariableDeclaration).initializer).not.to.be.equal(undefined);
    expect((statements[0] as VariableDeclaration).initializer instanceof Binary).to.be.equal(true);
  });
});
