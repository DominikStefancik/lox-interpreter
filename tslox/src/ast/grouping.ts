import { Expression } from './expression';

export class Grouping extends Expression {
  constructor(private readonly expression: Expression) {
    super();
  }
}
