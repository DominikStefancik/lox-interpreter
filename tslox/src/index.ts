// At the very beginning of the index.ts file we need to set up an alias which will be used to avoid using relative
// paths in imports
import 'module-alias/register';

import { Lox } from './lox';

const lox = new Lox();
lox.start();
