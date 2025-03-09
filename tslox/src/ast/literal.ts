import { Expression } from './expression';

export class Literal extends Expression {
  constructor(private readonly value: object) {
    super();
  }
}
