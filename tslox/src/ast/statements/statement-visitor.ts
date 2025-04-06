import { ExpressionStatement } from './expression-statement';
import { Print } from './print';
import { Block } from './block';
import { VariableDeclaration } from './variable-declaration';

export interface StatementVisitor<R> {
  visitExpressionStatementStatement: (statement: ExpressionStatement) => R;
  visitPrintStatement: (statement: Print) => R;
  visitBlockStatement: (statement: Block) => R;
  visitVariableDeclarationStatement: (statement: VariableDeclaration) => R;
}
