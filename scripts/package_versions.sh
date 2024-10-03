#!/bin/bash

SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
JQ_FILTER="$SCRIPT_DIR/package_versions.jq"


echo "./package.json" $(find -s ./dictionaries -name "package.json" -depth 2) \
    | xargs jq -f $JQ_FILTER | jq -s add
