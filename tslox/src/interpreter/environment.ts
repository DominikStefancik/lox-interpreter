import { RuntimeError } from '@local/interpreter/runtime-error';
import { Token } from '@local/scanning/token';

/**
 * Represents a "memory" of the interpreter where bindings that associate variables to values need to be stored
 */
export class Environment {
  private readonly values = new Map<string, object>();

  // if the enclosingEnvironment is not provided, the instance represents the global scope’s environment,
  // which ends the chain of nested environments
  constructor(private readonly enclosingEnvironment?: Environment) {}

  define(name: string, value: object): void {
    this.values.set(name, value);
  }

  get(name: Token): object {
    if (this.values.has(name.getLexeme())) {
      return this.values.get(name.getLexeme());
    }

    /**
     * If the variable isn’t found in this environment, we try the enclosing one. That in turn does the same thing
     * recursively, so this will ultimately walk the entire chain of environments.
     * If we reach an environment with no enclosing one and still don’t find the variable, then we give up
     * and report an error.
     */
    if (this.enclosingEnvironment) {
      return this.enclosingEnvironment.get(name);
    }

    throw new RuntimeError(name, `Undefined variable ${name.getLexeme()} .`);
  }

  assign(name: Token, value: object): void {
    // difference between assignment and definition is that assignment is not allowed to create a new variable
    if (this.values.has(name.getLexeme())) {
      this.values.set(name.getLexeme(), value);
      return;
    }

    if (this.enclosingEnvironment) {
      this.enclosingEnvironment.assign(name, value);
      return;
    }

    throw new RuntimeError(name, `Undefined variable ${name.getLexeme()} .`);
  }
}
