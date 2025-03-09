import { expressionTypes } from './lox-expression-definitions';
import * as fs from 'node:fs';

type classType = 'Expression' | 'Token' | 'Binary' | 'Unary' | 'object';

export interface ExpressionType {
  filename: string;
  className: string;
  fields: ExpressionField[];
  imports: string[];
}

interface ExpressionField {
  name: string;
  type: classType;
}

function generateImportSection(imports: string[]): string {
  return imports.reduce((accumulator, current) => accumulator + current + '\n', '');
}

function generateConstructorArgumentsList(fields: ExpressionField[]): string {
  return fields.reduce((accumulator, current, index) => {
    accumulator += `private readonly ${current.name}: ${current.type}`;

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
    }
  `;
}

function defineAst(outputDirPath: string, baseClassName: string, types: ExpressionType[]) {
  for (const type of types) {
    const content = generateFileContent(type, baseClassName);
    fs.writeFileSync(`${outputDirPath}/${type.filename}.ts`, content);
  }
}

const { argv } = process;

if (argv.length < 3) {
  throw new Error(`The argument for the output directory must be provided`);
}

defineAst(argv[2], 'Expression', expressionTypes);
