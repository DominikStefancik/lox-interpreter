import { expressionTypes } from './lox-expression-definitions';
import { generateAst } from './generate-ast-classes';
import { generateVisitor } from './generate-visitor';
import { statementTypes } from './lox-statement-definitions';

const { argv } = process;

if (argv.length < 3) {
  throw new Error(`The argument for the output directory must be provided`);
}

// Generate expression classes
generateAst({
  outputDirPath: `${argv[2]}/expressions`,
  baseClassName: 'Expression',
  types: expressionTypes,
});
generateVisitor({
  outputDirPath: `${argv[2]}/expressions`,
  baseClassName: 'Expression',
  visitorType: 'expression',
  types: expressionTypes,
});

// Generate statement classes
generateAst({
  outputDirPath: `${argv[2]}/statements`,
  baseClassName: 'Statement',
  types: statementTypes,
});
generateVisitor({
  outputDirPath: `${argv[2]}/statements`,
  baseClassName: 'Statement',
  visitorType: 'statement',
  types: statementTypes,
});
