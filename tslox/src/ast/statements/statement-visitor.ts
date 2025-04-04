import { ExpressionStatement } from './expression-statement';
import { Print } from './print';

export interface StatementVisitor<R> {
  visitExpressionStatementStatement: (statement: ExpressionStatement) => R;
  visitPrintStatement: (statement: Print) => R;
}
