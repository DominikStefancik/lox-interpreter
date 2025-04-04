import { StatementVisitor } from './statement-visitor';

export abstract class Statement {
  public abstract accept<R>(visitor: StatementVisitor<R>): R;
}
