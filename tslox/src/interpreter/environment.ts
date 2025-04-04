import { RuntimeError } from '@local/interpreter/runtime-error';
import { Token } from '@local/scanning/token';

/**
 * Represents a "memory" of the interpreter where bindings that associate variables to values need to be stored
 */
export class Environment {
  private readonly values = new Map<string, object>();

  define(name: string, value: object) {
    this.values.set(name, value);
  }

  get(name: Token): object {
    if (this.values.has(name.getLexeme())) {
      return this.values.get(name.getLexeme());
    }

    throw new RuntimeError(name, `Undefined variable ${name.getLexeme()} .`);
  }
}
