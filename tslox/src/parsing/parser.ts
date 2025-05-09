import { Token } from '@local/scanning/token';
import { TokenType } from '@local/scanning/token-type';
import { Lox } from '../lox';
import { ParseError } from './parse-error';
import { Expression } from '@local/ast/expressions/expression';
import { Binary } from '@local/ast/expressions/binary';
import { Unary } from '@local/ast/expressions/unary';
import { Literal } from '@local/ast/expressions/literal';
import { Grouping } from '@local/ast/expressions/grouping';
import { Statement } from '@local/ast/statements/statement';
import { Print } from '@local/ast/statements/print';
import { ExpressionStatement } from '@local/ast/statements/expression-statement';
import { VariableDeclaration } from '@local/ast/statements/variable-declaration';
import { Variable } from '@local/ast/expressions/variable';
import { Assignment } from '@local/ast/expressions/assignment';
import { Block } from '@local/ast/statements/block';

/**
 * The parser uses Recursive descent technique.
 *
 * Recursive descent is considered a top-down parser because it starts from the top or outermost grammar rule
 * and works its way down into the nested subexpressions before finally reaching the leaves of the syntax tree.
 * This is in contrast with bottom-up parsers like LR that start with primary expressions and compose them into
 * larger and larger chunks of syntax.
 *
 * A recursive descent parser is a literal translation of the grammar’s rules straight into imperative code.
 * Each rule becomes a function.
 */
export class Parser {
  // points at the token currently being parsed
  private current = 0;

  constructor(private readonly tokens: Token[]) {}

  /**
   * Parses the grammar rule:
   *
   *    program     ::= declaration* EOF ;
   *
   */
  parse(): Statement[] {
    const statements: Statement[] = [];

    while (!this.isAtEnd()) {
      statements.push(this.declaration());
    }

    return statements;
  }

  /**
   * Parses the grammar rule:
   *
   *    declaration     ::= variableDeclaration
   *                      | statement ;
   *
   */
  private declaration(): Statement {
    try {
      if (this.match([TokenType.VAR])) {
        return this.variableDeclaration();
      }

      return this.statement();
    } catch {
      this.synchronize();
      return null;
    }
  }

  /**
   * Parses the grammar rule:
   *
   *    variableDeclaration     ::= "var" IDENTIFIER ( "=" expression )? ";" ;
   *
   */
  private variableDeclaration(): Statement {
    const name = this.consume(TokenType.IDENTIFIER, 'Expect variable name.');
    let initializer = undefined;

    if (this.match([TokenType.EQUAL])) {
      initializer = this.expression();
    }

    this.consume(TokenType.SEMICOLON, `Expect ';' after variable declaration.`);
    return new VariableDeclaration(name, initializer);
  }

  /**
   * Parses the grammar rule:
   *
   *    statement     ::= expressionStatement
   *                    | printStatement
   *                    | block ;
   *
   */
  private statement(): Statement {
    if (this.match([TokenType.PRINT])) {
      return this.printStatement();
    }

    if (this.match([TokenType.LEFT_CURLY_BRACE])) {
      return new Block(this.block());
    }

    return this.expressionStatement();
  }

  /**
   * Parses the grammar rule:
   *
   *    expressionStatement     ::= expression
   *
   */
  private expressionStatement(): Statement {
    const expression = this.expression();

    this.consume(TokenType.SEMICOLON, `Expect ';' after expression.`);
    return new ExpressionStatement(expression);
  }

  /**
   * Parses the grammar rule:
   *
   *    printStatement     ::= "print" expression ";" ;
   *
   */
  private printStatement(): Statement {
    const expression = this.expression();

    this.consume(TokenType.SEMICOLON, `Expect ';' after expression.`);
    return new Print(expression);
  }

  /**
   * Parses the grammar rule:
   *
   *    block     ::= "{" declaration "}" ;
   *
   */
  private block(): Statement[] {
    const statements: Statement[] = [];

    while (!this.check(TokenType.RIGHT_CURLY_BRACE) && !this.isAtEnd()) {
      statements.push(this.declaration());
    }

    this.consume(TokenType.RIGHT_CURLY_BRACE, `Expect '}' after block.`);

    return statements;
  }

  /**
   * Parses the grammar rule:
   *
   *    expression     ::= assignment ;
   *
   */
  private expression(): Expression {
    return this.assignment();
  }

  /**
   * Parses the grammar rule:
   *
   *    assignment     ::= IDENTIFIER "=" assignment
   *                     | equality ;
   *
   */
  private assignment(): Expression {
    const expression = this.equality();

    if (this.match([TokenType.EQUAL])) {
      const equals = this.previous();
      const value = this.assignment();

      if (expression instanceof Variable) {
        return new Assignment((expression as Variable).name, value);
      }

      this.error(equals, 'Invalid assignment target');
    }

    return expression;
  }

  /**
   * Parses the grammar rule:
   *
   *    equality       ::= comparison ( ( "!=" | "==" ) comparison )* ;
   *
   */
  private equality(): Expression {
    let expression = this.comparison();

    while (this.match([TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL])) {
      const operator = this.previous();
      const right = this.comparison();
      expression = new Binary(expression, operator, right);
    }

    return expression;
  }

  /**
   * Parses the grammar rule:
   *
   *    comparison     ::= term ( ( ">" | ">=" | "<" | "<=" ) term )* ;
   *
   */
  private comparison(): Expression {
    let expression = this.term();

    while (
      this.match([TokenType.GREATER, TokenType.GREATER_EQUAL, TokenType.LESS, TokenType.LESS_EQUAL])
    ) {
      const operator = this.previous();
      const right = this.term();
      expression = new Binary(expression, operator, right);
    }

    return expression;
  }

  /**
   * Parses the grammar rule:
   *
   *    term           ::= factor ( ( "-" | "+" ) factor )* ;
   *
   */
  private term(): Expression {
    let expression = this.factor();

    while (this.match([TokenType.MINUS, TokenType.PLUS])) {
      const operator = this.previous();
      const right = this.factor();
      expression = new Binary(expression, operator, right);
    }

    return expression;
  }

  /**
   * Parses the grammar rule:
   *
   *    factor         ::= unary ( ( "/" | "*" ) unary )* ;
   *
   */
  private factor(): Expression {
    let expression = this.unary();

    while (this.match([TokenType.SLASH, TokenType.STAR])) {
      const operator = this.previous();
      const right = this.unary();
      expression = new Binary(expression, operator, right);
    }

    return expression;
  }

  /**
   * Parses the grammar rule:
   *
   *    unary          ::= ( "-" | "!" ) unary
   *                     | primary ;
   *
   */
  private unary(): Expression {
    if (this.match([TokenType.MINUS, TokenType.BANG])) {
      const operator = this.previous();
      const right = this.unary();
      return new Unary(operator, right);
    }

    return this.primary();
  }

  /**
   * Parses the grammar rule:
   *
   *    primary        ::= NUMBER | STRING
   *                     | "true" | "false" | "nil"
   *                     | "(" expression ")"
   *                     | IDENTIFIER ;
   *
   */
  private primary(): Expression {
    if (this.match([TokenType.TRUE])) {
      return new Literal('true');
    }

    if (this.match([TokenType.FALSE])) {
      return new Literal('false');
    }

    if (this.match([TokenType.NIL])) {
      return new Literal('nil');
    }

    if (this.match([TokenType.NUMBER])) {
      return new Literal(this.previous().getLiteral() as number);
    }

    if (this.match([TokenType.STRING])) {
      return new Literal(this.previous().getLiteral() as string);
    }

    if (this.match([TokenType.LEFT_PARENTHESES])) {
      const expression = this.expression();
      this.consume(TokenType.RIGHT_PARENTHESES, "Expect ')' after expression.");
      return new Grouping(expression);
    }

    if (this.match([TokenType.IDENTIFIER])) {
      const name = this.previous();
      return new Variable(name);
    }

    // If none of the cases match, it means we are sitting on a token that can’t start an expression
    throw this.error(this.peek(), 'Expect expression');
  }

  /**
   * Checks to see if the current token has any of the given types. If so, it consumes the token and returns true.
   * Otherwise, it returns false and leaves the current token alone
   *
   */
  private match(tokenTypes: TokenType[]): boolean {
    for (const type of tokenTypes) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }

    return false;
  }

  /**
   * Checks if the next token is of the expected type.
   * If so, it consumes the token. If some other token is there, then a parse error is thrown.
   *
   */
  private consume(tokenType: TokenType, message: string): Token {
    if (this.check(tokenType)) {
      return this.advance();
    }

    throw this.error(this.peek(), message);
  }

  /**
   * Returns true if the current token is of the given type. It never consumes the token, it only looks at it.
   *
   */
  private check(type: TokenType): boolean {
    if (this.isAtEnd()) {
      return false;
    }

    return this.peek().getType() === type;
  }

  /**
   * Consumes the current token and returns it
   *
   */
  private advance(): Token {
    if (!this.isAtEnd()) {
      this.current++;
    }

    return this.previous();
  }

  /**
   * Checks if there are tokens left to parse
   *
   */
  private isAtEnd(): boolean {
    return this.peek().getType() === TokenType.EOF;
  }

  /**
   * Returns the current token we have yet to consume
   *
   */
  private peek(): Token {
    return this.tokens[this.current];
  }

  /**
   * Returns the most recently consumed token
   *
   */
  private previous(): Token {
    return this.tokens[this.current - 1];
  }

  /**
   * Returns the error instead of throwing it.
   * It is on the calling method inside the parser to decide whether to stop or continue parsing
   *
   */
  private error(token: Token, message: string): ParseError {
    Lox.tokenError(token, message);
    return new ParseError('Error during parsing the code');
  }

  /**
   * Discards tokens until a statement boundary (i.e. semicolon) is found.
   * This method is called after catching a ParseError and then the parser is back in sync.
   *
   */
  private synchronize() {
    this.advance();

    while (!this.isAtEnd()) {
      if (this.previous().getType() === TokenType.SEMICOLON) return;

      switch (this.peek().getType()) {
        case TokenType.CLASS:
        case TokenType.FUN:
        case TokenType.VAR:
        case TokenType.FOR:
        case TokenType.IF:
        case TokenType.WHILE:
        case TokenType.PRINT:
        case TokenType.RETURN:
          return;
      }

      this.advance();
    }
  }
}
