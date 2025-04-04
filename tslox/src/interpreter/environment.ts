import { RuntimeError } from '@local/interpreter/runtime-error';
import { Token } from '@local/scanning/token';

/**
 * Represents a "memory" of the interpreter where bindings that associate variables to values need to be stored
 */
export class Environment {
  private readonly values = new Map<string, object>();

  define(name: string, value: object): void {
    this.values.set(name, value);
  }

  get(name: Token): object {
    if (this.values.has(name.getLexeme())) {
      return this.values.get(name.getLexeme());
    }

    throw new RuntimeError(name, `Undefined variable ${name.getLexeme()} .`);
  }

  assign(name: Token, value: object): void {
    // difference between assignment and definition is that assignment is not allowed to create a new variable
    if (this.values.has(name.getLexeme())) {
      this.values.set(name.getLexeme(), value);
      return;
    }

    throw new RuntimeError(name, `Undefined variable ${name.getLexeme()} .`);
  }
}
