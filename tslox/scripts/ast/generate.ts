import { expressionTypes } from './lox-expression-definitions';
import { generateAst } from './generate-ast-classes';
import { generateVisitor } from './generate-visitor';

const { argv } = process;

if (argv.length < 3) {
  throw new Error(`The argument for the output directory must be provided`);
}

generateAst(argv[2], 'Expression', expressionTypes);
generateVisitor(argv[2], 'Expression', expressionTypes);
