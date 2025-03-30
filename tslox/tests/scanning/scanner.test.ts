import 'module-alias/register';

import { expect } from 'chai';
import { Scanner } from '@local/scanning/scanner';
import { Token } from '@local/scanning/token';
import { TokenType } from '@local/scanning/token-type';
import { Lox } from '../../src/lox';

describe('Scanner', () => {
  it('scans operators', () => {
    const source = '!*+-/=<> <= ==';
    const sut = new Scanner(source);
    const tokens = sut.scanTokens();

    expect(tokens).to.be.an('array');
    expect(tokens).to.have.lengthOf(11);
    expect(tokens[0]).to.eql(new Token(TokenType.BANG, '!', null, 1));
    expect(tokens[1]).to.eql(new Token(TokenType.STAR, '*', null, 1));
    expect(tokens[2]).to.eql(new Token(TokenType.PLUS, '+', null, 1));
    expect(tokens[3]).to.eql(new Token(TokenType.MINUS, '-', null, 1));
    expect(tokens[4]).to.eql(new Token(TokenType.SLASH, '/', null, 1));
    expect(tokens[5]).to.eql(new Token(TokenType.EQUAL, '=', null, 1));
    expect(tokens[6]).to.eql(new Token(TokenType.LESS, '<', null, 1));
    expect(tokens[7]).to.eql(new Token(TokenType.GREATER, '>', null, 1));
    expect(tokens[8]).to.eql(new Token(TokenType.LESS_EQUAL, '<=', null, 1));
    expect(tokens[9]).to.eql(new Token(TokenType.EQUAL_EQUAL, '==', null, 1));
    expect(tokens[10]).to.eql(new Token(TokenType.EOF, '', null, 1));
  });

  it('scans an assignment', () => {
    const source = 'var language = "lox";';
    const sut = new Scanner(source);
    const tokens = sut.scanTokens();

    expect(tokens).to.be.an('array');
    expect(tokens).to.have.lengthOf(6);
    expect(tokens[0]).to.eql(new Token(TokenType.VAR, 'var', null, 1));
    expect(tokens[1]).to.eql(new Token(TokenType.IDENTIFIER, 'language', null, 1));
    expect(tokens[2]).to.eql(new Token(TokenType.EQUAL, '=', null, 1));
    expect(tokens[3]).to.eql(new Token(TokenType.STRING, '"lox"', 'lox', 1));
    expect(tokens[4]).to.eql(new Token(TokenType.SEMICOLON, ';', null, 1));
    expect(tokens[5]).to.eql(new Token(TokenType.EOF, '', null, 1));
  });

  it('scans an IF statement', () => {
    const source = 'if (a <= 4.86) {}';
    const sut = new Scanner(source);
    const tokens = sut.scanTokens();

    expect(tokens).to.be.an('array');
    expect(tokens).to.have.lengthOf(9);
    expect(tokens[0]).to.eql(new Token(TokenType.IF, 'if', null, 1));
    expect(tokens[1]).to.eql(new Token(TokenType.LEFT_PARENTHESES, '(', null, 1));
    expect(tokens[2]).to.eql(new Token(TokenType.IDENTIFIER, 'a', null, 1));
    expect(tokens[3]).to.eql(new Token(TokenType.LESS_EQUAL, '<=', null, 1));
    expect(tokens[4]).to.eql(new Token(TokenType.NUMBER, '4.86', 4.86, 1));
    expect(tokens[5]).to.eql(new Token(TokenType.RIGHT_PARENTHESES, ')', null, 1));
    expect(tokens[6]).to.eql(new Token(TokenType.LEFT_CURLY_BRACE, '{', null, 1));
    expect(tokens[7]).to.eql(new Token(TokenType.RIGHT_CURLY_BRACE, '}', null, 1));
    expect(tokens[8]).to.eql(new Token(TokenType.EOF, '', null, 1));
  });

  it('scans a multiline statement', () => {
    const source = `while (a * b >= 50.78) {
        if (greeting != "hello") {
          print "hello";
        }
        a = a + 1;
    }`;
    const sut = new Scanner(source);
    const tokens = sut.scanTokens();

    expect(tokens).to.be.an('array');
    expect(tokens).to.have.lengthOf(28);

    // first line
    expect(tokens[0]).to.eql(new Token(TokenType.WHILE, 'while', null, 1));
    expect(tokens[1]).to.eql(new Token(TokenType.LEFT_PARENTHESES, '(', null, 1));
    expect(tokens[2]).to.eql(new Token(TokenType.IDENTIFIER, 'a', null, 1));
    expect(tokens[3]).to.eql(new Token(TokenType.STAR, '*', null, 1));
    expect(tokens[4]).to.eql(new Token(TokenType.IDENTIFIER, 'b', null, 1));
    expect(tokens[5]).to.eql(new Token(TokenType.GREATER_EQUAL, '>=', null, 1));
    expect(tokens[6]).to.eql(new Token(TokenType.NUMBER, '50.78', 50.78, 1));
    expect(tokens[7]).to.eql(new Token(TokenType.RIGHT_PARENTHESES, ')', null, 1));
    expect(tokens[8]).to.eql(new Token(TokenType.LEFT_CURLY_BRACE, '{', null, 1));

    // second line
    expect(tokens[9]).to.eql(new Token(TokenType.IF, 'if', null, 2));
    expect(tokens[10]).to.eql(new Token(TokenType.LEFT_PARENTHESES, '(', null, 2));
    expect(tokens[11]).to.eql(new Token(TokenType.IDENTIFIER, 'greeting', null, 2));
    expect(tokens[12]).to.eql(new Token(TokenType.BANG_EQUAL, '!=', null, 2));
    expect(tokens[13]).to.eql(new Token(TokenType.STRING, '"hello"', 'hello', 2));
    expect(tokens[14]).to.eql(new Token(TokenType.RIGHT_PARENTHESES, ')', null, 2));
    expect(tokens[15]).to.eql(new Token(TokenType.LEFT_CURLY_BRACE, '{', null, 2));

    // third line
    expect(tokens[16]).to.eql(new Token(TokenType.PRINT, 'print', null, 3));
    expect(tokens[17]).to.eql(new Token(TokenType.STRING, '"hello"', 'hello', 3));
    expect(tokens[18]).to.eql(new Token(TokenType.SEMICOLON, ';', null, 3));

    // fourth line
    expect(tokens[19]).to.eql(new Token(TokenType.RIGHT_CURLY_BRACE, '}', null, 4));

    // fifth line
    expect(tokens[20]).to.eql(new Token(TokenType.IDENTIFIER, 'a', null, 5));
    expect(tokens[21]).to.eql(new Token(TokenType.EQUAL, '=', null, 5));
    expect(tokens[22]).to.eql(new Token(TokenType.IDENTIFIER, 'a', null, 5));
    expect(tokens[23]).to.eql(new Token(TokenType.PLUS, '+', null, 5));
    expect(tokens[24]).to.eql(new Token(TokenType.NUMBER, '1', 1, 5));
    expect(tokens[25]).to.eql(new Token(TokenType.SEMICOLON, ';', null, 5));

    // sixth line
    expect(tokens[26]).to.eql(new Token(TokenType.RIGHT_CURLY_BRACE, '}', null, 6));

    expect(tokens[27]).to.eql(new Token(TokenType.EOF, '', null, 6));
  });

  it('ignores comments and empty lines correctly', () => {
    const source = `if (a != 0) {
          // we are sure that division won't cause an error
          b = b / a;
        }
        
        
        return b;
    }`;
    const sut = new Scanner(source);
    const tokens = sut.scanTokens();

    expect(tokens).to.be.an('array');
    expect(tokens).to.have.lengthOf(19);

    // first line
    expect(tokens[0]).to.eql(new Token(TokenType.IF, 'if', null, 1));
    expect(tokens[1]).to.eql(new Token(TokenType.LEFT_PARENTHESES, '(', null, 1));
    expect(tokens[2]).to.eql(new Token(TokenType.IDENTIFIER, 'a', null, 1));
    expect(tokens[3]).to.eql(new Token(TokenType.BANG_EQUAL, '!=', null, 1));
    expect(tokens[4]).to.eql(new Token(TokenType.NUMBER, '0', 0, 1));
    expect(tokens[5]).to.eql(new Token(TokenType.RIGHT_PARENTHESES, ')', null, 1));
    expect(tokens[6]).to.eql(new Token(TokenType.LEFT_CURLY_BRACE, '{', null, 1));

    // third line
    expect(tokens[7]).to.eql(new Token(TokenType.IDENTIFIER, 'b', null, 3));
    expect(tokens[8]).to.eql(new Token(TokenType.EQUAL, '=', null, 3));
    expect(tokens[9]).to.eql(new Token(TokenType.IDENTIFIER, 'b', null, 3));
    expect(tokens[10]).to.eql(new Token(TokenType.SLASH, '/', null, 3));
    expect(tokens[11]).to.eql(new Token(TokenType.IDENTIFIER, 'a', null, 3));
    expect(tokens[12]).to.eql(new Token(TokenType.SEMICOLON, ';', null, 3));

    // fourth line
    expect(tokens[13]).to.eql(new Token(TokenType.RIGHT_CURLY_BRACE, '}', null, 4));

    // seventh line
    expect(tokens[14]).to.eql(new Token(TokenType.RETURN, 'return', null, 7));
    expect(tokens[15]).to.eql(new Token(TokenType.IDENTIFIER, 'b', null, 7));
    expect(tokens[16]).to.eql(new Token(TokenType.SEMICOLON, ';', null, 7));

    // eight line
    expect(tokens[17]).to.eql(new Token(TokenType.RIGHT_CURLY_BRACE, '}', null, 8));

    expect(tokens[18]).to.eql(new Token(TokenType.EOF, '', null, 8));
  });

  it('reports error when an unknown characters are found', () => {
    const source = '!*+-/=<> ?$ ==';
    const sut = new Scanner(source);
    sut.scanTokens();

    expect(Lox.hadError).to.be.equal(true);
  });

  it('reports error when a string is not properly terminated', () => {
    const source = 'var language = "lox';
    const sut = new Scanner(source);
    sut.scanTokens();

    expect(Lox.hadError).to.be.equal(true);
  });
});
