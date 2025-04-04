import { Print } from './print';

export interface StatementVisitor<R> {
  visitPrintStatement: (statement: Print) => R;
}
