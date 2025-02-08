import { Token } from '@local/scanning/token';

export class Scanner {
  constructor(private readonly source: string) {}

  public scanTokens(): Token[] {
    return [];
  }
}
