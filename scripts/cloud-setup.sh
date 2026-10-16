#!/bin/bash
# Installs the tools Weft needs in Claude Code cloud sessions. Does nothing on a local machine.
if [ "$CLAUDE_CODE_REMOTE" != "true" ]; then
  exit 0
fi
if ! command -v shopify >/dev/null 2>&1; then
  npm install -g @shopify/cli@latest >/dev/null 2>&1 || true
fi
if [ -f package.json ] && [ ! -d node_modules ]; then
  npm install >/dev/null 2>&1 || true
fi
exit 0
