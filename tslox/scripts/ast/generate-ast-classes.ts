import * as fs from 'node:fs';

type ClassType =
  | 'Expression'
  | 'Token'
  | 'Binary'
  | 'Unary'
  | `number | string | 'true' | 'false' | 'nil'`;

export interface ExpressionType {
  filename: string;
  className: string;
  fields: ExpressionField[];
  imports: string[];
}

interface ExpressionField {
  name: string;
  type: ClassType;
}

function generateImportSection(imports: string[]): string {
  return imports.reduce((accumulator, current) => accumulator + current + '\n', '');
}

function generateConstructorArgumentsList(fields: ExpressionField[]): string {
  return fields.reduce((accumulator, current, index) => {
    accumulator += `public readonly ${current.name}: ${current.type}`;

    if (index != fields.length - 1) {
      accumulator += ',';
    }

    return accumulator;
  }, '');
}

function generateFileContent(type: ExpressionType, baseClassName: string): string {
  return `
    ${generateImportSection(type.imports)}
    
    export class ${type.className} extends ${baseClassName} {
      constructor(
        ${generateConstructorArgumentsList(type.fields)}
      ) {
        super();
      }
      
      public accept<R>(visitor: ExpressionVisitor<R>): R {
        return visitor.visit${type.className}${baseClassName}(this);
      }
    }
  `;
}

export function generateAst(outputDirPath: string, baseClassName: string, types: ExpressionType[]) {
  for (const type of types) {
    const content = generateFileContent(type, baseClassName);
    fs.writeFileSync(`${outputDirPath}/${type.filename}.ts`, content);
  }
}
