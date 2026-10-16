// Shared by scripts/package-theme.mjs and tests/unit/package.test.mjs.

// Removes every line from a line containing "integration:start" to the next line containing
// "integration:end" (Liquid comments, `#` comments in {% liquid %}, /* */ in JS and CSS).
export const stripRegions = (src) => {
  const out = [];
  let skipping = false;
  for (const line of src.split('\n')) {
    if (!skipping && line.includes('integration:start')) {
      skipping = true;
      continue;
    }
    if (skipping) {
      if (line.includes('integration:end')) skipping = false;
      continue;
    }
    out.push(line);
  }
  if (skipping) throw new Error('integration:start without integration:end');
  return out.join('\n');
};
