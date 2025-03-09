import { TokenType } from '@local/scanning/token-type';

export class Token {
  constructor(
    private readonly type: TokenType,
    private readonly lexeme: string,
    private readonly literal: unknown,
    private readonly line: number
  ) {}

  public getLexeme(): string {
    return this.lexeme;
  }

  public toString(): string {
    return `Token { type: ${TokenType[this.type]}, lexeme: ${this.lexeme}, literal: ${this.literal}, line: ${this.line} }`;
  }
}
