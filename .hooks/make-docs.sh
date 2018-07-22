#!/bin/bash
echo "Disabled docs creation"
exit 0


GITROOT="$(git rev-parse --show-toplevel)"

echo "Creating md files from jsdoc"
JSDOC="$GITROOT/docs/README.md"

JSINPUT="$(find -iname '*.js' -not -path './node_modules/*' -not -iname '*.min.js' -not -iname '.eslintrc.js' -printf '%p ')"

"$GITROOT/node_modules/.bin/jsdoc2md" "$JSINPUT" --private >> "$JSDOC"
