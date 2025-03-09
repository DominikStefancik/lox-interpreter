import { Expression } from './expression';
import { Token } from '../scanning/token';

export class Unary extends Expression {
  constructor(
    private readonly operator: Token,
    private readonly right: Expression
  ) {
    super();
  }
}
