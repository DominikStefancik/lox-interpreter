import { Token } from '@local/scanning/token';
import { Lox } from '../lox';
import { TokenType } from '@local/scanning/token-type';

export class Scanner {
  private readonly tokenList: Token[] = [];
  // points to the first character in the lexeme being scanned
  private start: number = 0;
  // points at the character currently being considered
  private current: number = 0;
  // tracks what source line current is on so we can produce tokens that know their location
  private line: number = 1;
  // a list of keywords
  private readonly keywords: Map<string, TokenType>;

  constructor(private readonly source: string) {
    this.keywords = new Map<string, TokenType>();
    this.keywords.set('and', TokenType.AND);
    this.keywords.set('class', TokenType.CLASS);
    this.keywords.set('else', TokenType.ELSE);
    this.keywords.set('false', TokenType.FALSE);
    this.keywords.set('for', TokenType.FOR);
    this.keywords.set('fun', TokenType.FUN);
    this.keywords.set('if', TokenType.IF);
    this.keywords.set('nil', TokenType.NIL);
    this.keywords.set('or', TokenType.OR);
    this.keywords.set('print', TokenType.PRINT);
    this.keywords.set('return', TokenType.RETURN);
    this.keywords.set('super', TokenType.SUPER);
    this.keywords.set('this', TokenType.THIS);
    this.keywords.set('true', TokenType.TRUE);
    this.keywords.set('var', TokenType.VAR);
    this.keywords.set('while', TokenType.WHILE);
  }

  public scanTokens(): Token[] {
    while (!this.isAtEnd()) {
      // We are at the beginning of the next lexeme.
      this.start = this.current;
      this.scanToken();
    }

    // at the end we add the token signalising the end of file
    this.tokenList.push(new Token(TokenType.EOF, '', null, this.line));
    return this.tokenList;
  }

  private scanToken() {
    const character = this.advance();

    switch (character) {
      case '(':
        this.addNonLiteralToken(TokenType.LEFT_PARENTHESES);
        break;
      case ')':
        this.addNonLiteralToken(TokenType.RIGHT_PARENTHESES);
        break;
      case '{':
        this.addNonLiteralToken(TokenType.LEFT_CURLY_BRACE);
        break;
      case '}':
        this.addNonLiteralToken(TokenType.RIGHT_CURLY_BRACE);
        break;
      case ',':
        this.addNonLiteralToken(TokenType.COMMA);
        break;
      case '.':
        this.addNonLiteralToken(TokenType.DOT);
        break;
      case '-':
        this.addNonLiteralToken(TokenType.MINUS);
        break;
      case '+':
        this.addNonLiteralToken(TokenType.PLUS);
        break;
      case ';':
        this.addNonLiteralToken(TokenType.SEMICOLON);
        break;
      case '*':
        this.addNonLiteralToken(TokenType.STAR);
        break;
      case '!':
        this.addNonLiteralToken(this.match('=') ? TokenType.BANG_EQUAL : TokenType.BANG);
        break;
      case '=':
        this.addNonLiteralToken(this.match('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL);
        break;
      case '<':
        this.addNonLiteralToken(this.match('=') ? TokenType.LESS_EQUAL : TokenType.LESS);
        break;
      case '>':
        this.addNonLiteralToken(this.match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER);
        break;
      case '/':
        if (this.match('/')) {
          // A comment goes until the end of the line.
          while (this.peek() != '\n' && !this.isAtEnd()) this.advance();
        } else {
          this.addNonLiteralToken(TokenType.SLASH);
        }
        break;
      case ' ':
      case '\r':
      case '\t':
        // Ignore whitespace.
        break;
      case '\n':
        this.line++;
        break;
      case '"':
        this.addStringToken();
        break;
      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        this.addNumberToken();
        break;

      default:
        if (this.isAlpha(character)) {
          this.addIdentifierToken();
        } else {
          Lox.error(this.line, 'Unknown character: ' + character);
        }
        break;
    }
  }

  private addNonLiteralToken(type: TokenType) {
    return this.addToken(type, null);
  }

  private addStringToken() {
    while (this.peek() != '"' && !this.isAtEnd()) {
      // need to update line when we hit a newline inside a string
      if (this.peek() == '\n') {
        this.line++;
      }

      this.advance();
    }
    if (this.isAtEnd()) {
      Lox.error(this.line, 'Unterminated string.');
      return;
    }

    // The closing ".
    this.advance();

    // Trim the surrounding quotes.
    const value = this.source.substring(this.start + 1, this.current - 1);
    this.addToken(TokenType.STRING, value);
  }

  private addNumberToken() {
    // Consume digits
    while (this.isDigit(this.peek())) {
      this.advance();
    }

    // Look for a fractional part.
    if (this.peek() == '.' && this.isDigit(this.peekNext())) {
      // Consume the "."
      this.advance();
      // Consume digits after the "."
      while (this.isDigit(this.peek())) {
        this.advance();
      }
    }
    this.addToken(TokenType.NUMBER, parseFloat(this.source.substring(this.start, this.current)));
  }

  private addIdentifierToken() {
    while (this.isAlphaNumeric(this.peek())) {
      this.advance();
    }
    this.addNonLiteralToken(TokenType.IDENTIFIER);
  }

  private addToken(type: TokenType, literal: unknown) {
    const text = this.source.substring(this.start, this.current);
    this.tokenList.push(new Token(type, text, literal, this.line));
  }

  private isAtEnd(): boolean {
    return this.current >= this.source.length;
  }

  private peek(): string {
    if (this.isAtEnd()) {
      return '\0';
    }

    return this.source.charAt(this.current);
  }

  private peekNext(): string {
    if (this.current + 1 >= this.source.length) {
      return '\0';
    }

    return this.source.charAt(this.current + 1);
  }

  private advance(): string {
    this.current++;

    return this.source.charAt(this.current);
  }

  private match(expected: string): boolean {
    if (this.isAtEnd()) {
      return false;
    }

    if (this.source.charAt(this.current) !== expected) {
      return false;
    }

    this.current++;
    return true;
  }

  private isDigit(char: string): boolean {
    return char >= '0' && char <= '9';
  }

  private isAlpha(char: string): boolean {
    return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z') || char == '_';
  }

  private isAlphaNumeric(char: string): boolean {
    return this.isAlpha(char) || this.isDigit(char);
  }
}
