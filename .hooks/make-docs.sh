#!/bin/bash

GITROOT="$(git rev-parse --show-toplevel)"

echo "Creating md files from jsdoc"
JSDOC="$GITROOT/docs/README.md"

echo "Auto-Generated from JSDocs." > "$JSDOC"
find "$GITROOT" -iname '*.js' -not -path '*/node_modules/*' -not -iname '*.min.js' -not -iname '.eslintrc.js' -print0 | while IFS= read -r -d $'\0' line; do
  echo "Creating doc for $line"
  "$GITROOT/node_modules/.bin/jsdoc2md" "$line" --private >> "$JSDOC"
done
rm -rf /tmp/jsdoc-api/
rm -rf /tmp/dmd/
