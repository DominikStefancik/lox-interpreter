import * as process from 'node:process';
import * as fs from 'node:fs';
import * as readline from 'node:readline';
import { Scanner } from '@local/scanning/scanner';
import { Token } from '@local/scanning/token';
import { TokenType } from '@local/scanning/token-type';
import { Parser } from '@local/parsing/parser';
import { RuntimeError } from '@local/interpreter/runtime-error';
import { Interpreter } from '@local/interpreter/interpreter';

export class Lox {
  /**
   * The interpreter has to be static, so that successive calls to run() inside a REPL session reuse the same instance.
   * This is important for global variables. Those variables should persist throughout the REPL session.
   */
  public static readonly interpreter: Interpreter = new Interpreter();
  public static hadError: boolean = false;
  public static hadRuntimeError: boolean = false;

  public start() {
    const { argv } = process;
    const args = argv.slice(2);

    if (args.length > 1) {
      console.log('Usage: tslox [script]');
      process.exit(1);
    } else if (args.length === 1) {
      this.runFile(args[0]);
    } else {
      this.runPrompt();
    }
  }

  private runFile(filename: string) {
    const fileContent = fs.readFileSync(filename, { encoding: 'utf-8' }).toString();
    this.run(fileContent);

    if (Lox.hadError) {
      process.exit(65);
    }

    if (Lox.hadRuntimeError) {
      process.exit(70);
    }
  }

  private runPrompt() {
    const promptInterface = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    promptInterface
      .on('SIGTSTP', () => promptInterface.close())
      .on('line', (line) => {
        this.run(line);
        // in the interactive mode, if the user makes a mistake, it shouldn’t kill their entire session.
        Lox.hadError = false;
        promptInterface.prompt();
      });

    promptInterface.prompt();
  }

  private run(source: string) {
    const scanner = new Scanner(source);
    const tokens = scanner.scanTokens();
    const parser = new Parser(tokens);
    const expression = parser.parse();

    if (Lox.hadError) {
      return;
    }

    Lox.interpreter.interpret(expression);
  }

  public static error(line: number, message: string) {
    Lox.report(line, '', message);
  }

  public static tokenError(token: Token, message: string) {
    if (token.getType() === TokenType.EOF) {
      Lox.report(token.getLine(), ' at end', message);
    } else {
      Lox.report(token.getLine(), " at '" + token.getLexeme() + "'", message);
    }
  }

  public static runtimeError(error: RuntimeError) {
    console.error(`${error.getMessage()} [line ${error.getToken().getLine()}]`);
    Lox.hadRuntimeError = true;
  }

  private static report(line: number, where: string, message: string) {
    console.error(`[line ${line}] Error ${where}: ${message}]`);
    Lox.hadError = true;
  }
}
