import * as fs from 'node:fs';

type ExpressionType =
  | 'Expression'
  | 'Token'
  | 'Binary'
  | 'Unary'
  | `number | string | boolean | 'nil'`;
type StatementType = 'Statement';
type ClassType = ExpressionType | StatementType;

export interface AstNodeType {
  filename: string;
  className: string;
  fields: AstNodeField[];
  imports: string[];
}

interface AstNodeField {
  name: string;
  type: ClassType;
}

function generateImportSection(imports: string[]): string {
  return imports.reduce((accumulator, current) => accumulator + current + '\n', '');
}

function generateConstructorArgumentsList(fields: AstNodeField[]): string {
  return fields.reduce((accumulator, current, index) => {
    accumulator += `public readonly ${current.name}: ${current.type}`;

    if (index != fields.length - 1) {
      accumulator += ',';
    }

    return accumulator;
  }, '');
}

function generateFileContent(type: AstNodeType, baseClassName: string): string {
  return `
    ${generateImportSection(type.imports)}
    
    export class ${type.className} extends ${baseClassName} {
      constructor(
        ${generateConstructorArgumentsList(type.fields)}
      ) {
        super();
      }
      
      public accept<R>(visitor: ${baseClassName}Visitor<R>): R {
        return visitor.visit${type.className}${baseClassName}(this);
      }
    }
  `;
}

export function generateAst({
  outputDirPath,
  baseClassName,
  types,
}: {
  outputDirPath: string;
  baseClassName: string;
  types: AstNodeType[];
}) {
  for (const type of types) {
    const content = generateFileContent(type, baseClassName);
    fs.writeFileSync(`${outputDirPath}/${type.filename}.ts`, content);
  }
}
