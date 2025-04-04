import { ExpressionStatement } from './expression-statement';
import { Print } from './print';
import { VariableDeclaration } from './variable-declaration';

export interface StatementVisitor<R> {
  visitExpressionStatementStatement: (statement: ExpressionStatement) => R;
  visitPrintStatement: (statement: Print) => R;
  visitVariableDeclarationStatement: (statement: VariableDeclaration) => R;
}
