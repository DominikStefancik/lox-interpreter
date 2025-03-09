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
    accumulator += `visit${currentType.className}${baseClassName}: (expression: ${currentType.className}) => ${baseClassName}\n`;

    return accumulator;
  }, '');
}

export function generateVisitor(
  outputDirPath: string,
  baseClassName: string,
  types: ExpressionType[]
) {
  const content = `
    import { ${baseClassName} } from './${baseClassName.toLowerCase()}'
    ${generateImportSection(types)}
    
    export interface ExpressionVisitor {
        ${generateVisitorFunctions(types, baseClassName)}
    }
  `;

  fs.writeFileSync(`${outputDirPath}/expression-visitor.ts`, content);
}
