#!/bin/bash

# uses jsmin

SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
JQ_FILTER="$SCRIPT_DIR/dictionary.jq"

# Generate a markdown list of dictionaries.
# Run from repo root.

# cspell:ignore execdir jsmin

HEADER="\
## All Dictionaries

<!--- Use \`yarn build:readme\` to generate this table --->

| package | dictionary ID | name | description |
| --- | --- | --- | --- | \
"

NL="
"

echo "$HEADER"

FILES=$(ls dictionaries/*/package.json)
DIRS=$(dirname $FILES | sort)

LINES=""

for DIR in $DIRS; do
    PKG="$DIR/package.json"
    NAME=$(jq -j .name $PKG)
    INFO=$(json5 $DIR/cspell-ext.json | jq -j -f $JQ_FILTER)
    LINES+="$(printf '| [%s](./%s#readme) %s |' "$NAME" "$DIR" "$INFO")$NL"
done

echo "$LINES"
