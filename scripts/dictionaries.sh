#!/bin/bash

# uses jsmin

SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
JQ_FILTER="$SCRIPT_DIR/dictionary.jq"

# Generate a markdown list of dictionaries.
# Run from repo root.

# cspell:ignore execdir jsmin

echo "## All Dictionaries"
echo ""
echo "<!--- Use \`yarn run generate-doc-dictionaries\` to generate this table --->"
echo ""
echo "| package | dictionary ID | name | description |"
echo "| -- | -- | -- | -- | -- |"
find ./dictionaries -name "package.json" -depth 2 \
    -execdir echo -n "| [" \; \
    -execdir jq -j .name package.json \; \
    -execdir echo -n "](" \; \
    -exec sh -c "dirname {} | xargs echo -n" \; \
    -execdir echo -n "#readme) " \; \
    -execdir sh -c "cat cspell-ext.json | jsmin | jq -j -f $JQ_FILTER" \; \
    -execdir echo "" \; \
    | sort
