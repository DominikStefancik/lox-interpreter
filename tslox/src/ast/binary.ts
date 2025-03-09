import { Expression } from './expression';
import { Token } from '../scanning/token';

export class Binary extends Expression {
  constructor(
    private readonly left: Expression,
    private readonly operator: Token,
    private readonly right: Expression
  ) {
    super();
  }
}
