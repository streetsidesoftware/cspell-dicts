#!/bin/bash

# uses jsmin

# Generate a markdown list of dictionaries.
# Run from repo root.

# cspell:ignore execdir jsmin

echo "# Dictionaries"
echo "<!--- This file is generated from ./scripts/dictionaries.sh --->"
echo ""
echo "| dictionary | name | description |"
echo "| -- | -- | -- |"
find -s ./dictionaries -name "package.json" -depth 2 \
    -execdir echo -n "| [" \; \
    -execdir jq -j .name package.json \; \
    -exec echo -n "]("{}") | " \; \
    -execdir sh -c "cat cspell-ext.json | jsmin | jq -j .name" \; \
    -execdir echo -n " | " \; \
    -execdir sh -c "cat cspell-ext.json | jsmin | jq -j .description" \; \
    -execdir echo " |" \;
