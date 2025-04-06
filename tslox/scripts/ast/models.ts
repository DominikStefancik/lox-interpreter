type ExpressionType =
  | 'Expression'
  | 'Token'
  | 'Binary'
  | 'Unary'
  | `number | string | boolean | 'nil'`;

type StatementType = 'Statement' | 'Statement[]';

export type ClassType = ExpressionType | StatementType;

export interface AstNodeType {
  filename: string;
  className: string;
  fields: AstNodeField[];
  imports: string[];
}

export interface AstNodeField {
  name: string;
  type: ClassType;
  isOptional?: boolean;
}

export enum VisitorType {
  expression = 'expression',
  statement = 'statement',
}
