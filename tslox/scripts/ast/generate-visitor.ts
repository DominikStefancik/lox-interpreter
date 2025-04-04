import * as fs from 'node:fs';
import { AstNodeType } from './generate-ast-classes';

type VisitorType = 'expression' | 'statement';

function generateImportSection(types: AstNodeType[]): string {
  return types.reduce((accumulator, currentType) => {
    accumulator += `import { ${currentType.className} } from './${currentType.filename}'\n`;

    return accumulator;
  }, '');
}

function generateVisitorFunctions(
  types: AstNodeType[],
  baseClassName: string,
  parameterName
): string {
  return types.reduce((accumulator, currentType) => {
    accumulator += `visit${currentType.className}${baseClassName}: (${parameterName}: ${currentType.className}) => R;\n`;

    return accumulator;
  }, '');
}

export function generateVisitor({
  outputDirPath,
  baseClassName,
  visitorType,
  types,
}: {
  outputDirPath: string;
  baseClassName: string;
  visitorType: VisitorType;
  types: AstNodeType[];
}) {
  const content = `
    ${generateImportSection(types)}
    
    export interface ${baseClassName}Visitor<R> {
        ${generateVisitorFunctions(types, baseClassName, visitorType)}
    }
  `;

  fs.writeFileSync(`${outputDirPath}/${visitorType}-visitor.ts`, content);
}
