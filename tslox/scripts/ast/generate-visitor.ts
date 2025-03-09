import * as fs from 'node:fs';
import { ExpressionType } from './generate-ast-classes';

function generateImportSection(types: ExpressionType[]): string {
  return types.reduce((accumulator, currentType) => {
    accumulator += `import { ${currentType.className} } from './${currentType.filename}'\n`;

    return accumulator;
  }, '');
}

function generateVisitorFunctions(types: ExpressionType[], baseClassName: string): string {
  return types.reduce((accumulator, currentType) => {
    accumulator += `visit${currentType.className}${baseClassName}: (expression: ${currentType.className}) => R;\n`;

    return accumulator;
  }, '');
}

export function generateVisitor(
  outputDirPath: string,
  baseClassName: string,
  types: ExpressionType[]
) {
  const content = `
    ${generateImportSection(types)}
    
    export interface ExpressionVisitor<R> {
        ${generateVisitorFunctions(types, baseClassName)}
    }
  `;

  fs.writeFileSync(`${outputDirPath}/expression-visitor.ts`, content);
}
