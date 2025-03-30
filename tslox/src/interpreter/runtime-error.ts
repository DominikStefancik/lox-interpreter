import { Token } from '@local/scanning/token';

export class RuntimeError extends Error {
  constructor(
    private readonly token: Token,
    message: string
  ) {
    super(message);
  }

  public getToken(): Token {
    return this.token;
  }

  public getMessage(): string {
    return this.message;
  }
}
