const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(full));
    } else {
      if (/\.(tsx|ts|jsx|js)$/.test(full)) results.push(full);
    }
  });
  return results;
}

function scanFile(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Strip strings and comments to avoid matching hooks inside demo code blocks or commented code
  // Remove block comments
  content = content.replace(/\/\*[\s\S]*?\*\//g, '');
  // Remove line comments
  content = content.replace(/(^|[^:\\])\/\/.*$/gm, '$1');
  // Remove backtick, single and double quoted strings
  content = content.replace(/`(?:\\`|[^`])*`/g, '');
  content = content.replace(/'(?:\\'|[^'])*'/g, '');
  content = content.replace(/"(?:\\"|[^"])*"/g, '');

  const hookRegex = /\buse(?:State|Effect|Memo|Ref|Callback|Context|Reducer)\b/g;
  const returnRegex = /\breturn\b/g;

  const hookMatches = [...content.matchAll(hookRegex)];
  const returnMatches = [...content.matchAll(returnRegex)];

  if (hookMatches.length === 0) return null;

  const firstHookIdx = hookMatches[0].index;
  const firstReturnIdx = returnMatches.length ? returnMatches[0].index : Infinity;

  // Heuristic: if a return appears before the first hook, flag it.
  if (firstReturnIdx < firstHookIdx) {
    return { file, firstReturnIdx, firstHookIdx };
  }
  return null;
}

const root = path.resolve(__dirname, '..');
const appDir = path.join(root, 'app');
if (!fs.existsSync(appDir)) {
  console.error('No app directory found at', appDir);
  process.exit(1);
}

const files = walk(appDir);
const flagged = [];
files.forEach(f => {
  try {
    const res = scanFile(f);
    if (res) flagged.push(res);
  } catch (e) {
    // ignore
  }
});

if (flagged.length === 0) {
  console.log('No obvious files where a `return` appears before hook declarations were found.');
  process.exit(0);
}

console.log('Potential problematic files (return before first hook):');
flagged.forEach(f => {
  console.log('-', f.file);
});
process.exit(0);
