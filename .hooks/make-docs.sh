#!/bin/bash

GITROOT="$(git rev-parse --show-toplevel)"

echo "Creating md files from jsdoc"
JSDOC="$GITROOT/docs/README.md"

echo "Auto-Generated from JSDocs." > "$JSDOC"

FILES="$(find $GITROOT -iname '*.js' -not -path '*/node_modules/*' -not -iname '*.min.js' -not -iname '.eslintrc.js' -printf '%p ')"

"$GITROOT/node_modules/.bin/jsdoc2md" $FILES --private >> "$JSDOC"

rm -rf /tmp/jsdoc-api/
rm -rf /tmp/dmd/
