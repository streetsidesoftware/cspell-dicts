#!/bin/bash

# uses jsmin

SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
JQ_FILTER="$SCRIPT_DIR/dictionary.jq"

# Generate a markdown list of dictionaries.
# Run from repo root.

# cspell:ignore execdir jsmin

echo "# Dictionaries"
echo "<!--- This file is generated from ./scripts/dictionaries.sh --->"
echo ""
echo "| dictionary | name | file type | locale | description |"
echo "| -- | -- | -- | -- | -- |"
find -s ./dictionaries -name "package.json" -depth 2 \
    -execdir echo -n "| [" \; \
    -execdir jq -j .name package.json \; \
    -execdir echo -n "](" \; \
    -exec sh -c "dirname {} | xargs echo -n" \; \
    -execdir echo -n "#readme) " \; \
    -execdir sh -c "cat cspell-ext.json | jsmin | jq -j -f $JQ_FILTER" \; \
    -execdir echo "" \;
