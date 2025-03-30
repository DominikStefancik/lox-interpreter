import * as process from 'node:process';
import * as fs from 'node:fs';
import * as readline from 'node:readline';
import { Scanner } from '@local/scanning/scanner';
import { Token } from '@local/scanning/token';
import { TokenType } from '@local/scanning/token-type';
import { Parser } from '@local/parsing/parser';
import { AstPrinter } from '@local/ast/ast-printer';

export class Lox {
  public static hasError: boolean = false;

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

    if (Lox.hasError) {
      process.exit(1);
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
        Lox.hasError = false;
        promptInterface.prompt();
      });

    promptInterface.prompt();
  }

  private run(source: string) {
    const scanner = new Scanner(source);
    const tokens = scanner.scanTokens();
    const parser = new Parser(tokens);
    const expression = parser.parse();

    if (Lox.hasError) {
      return;
    }

    console.log(new AstPrinter().print(expression));
  }

  public static error(line: number, message: string) {
    Lox.report(line, '', message);
  }

  public static tokenError(token: Token, message: string) {
    if (token.getType() == TokenType.EOF) {
      Lox.report(token.getLine(), ' at end', message);
    } else {
      Lox.report(token.getLine(), " at '" + token.getLexeme() + "'", message);
    }
  }

  private static report(line: number, where: string, message: string) {
    console.error(`[line ${line}] Error ${where}: ${message}]`);
    Lox.hasError = true;
  }
}
