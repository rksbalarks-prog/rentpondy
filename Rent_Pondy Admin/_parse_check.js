// Parse-only sanity check for edited JSX files, using the project's own Babel.
const fs = require('fs');
const parser = require('@babel/parser');

const files = process.argv.slice(2);
let bad = 0;

for (const f of files) {
  try {
    parser.parse(fs.readFileSync(f, 'utf8'), {
      sourceType: 'module',
      plugins: ['jsx', 'classProperties', 'optionalChaining', 'nullishCoalescingOperator'],
    });
    console.log('OK   ' + f);
  } catch (e) {
    bad++;
    console.log('FAIL ' + f + '  -> ' + e.message);
  }
}

process.exit(bad ? 1 : 0);
