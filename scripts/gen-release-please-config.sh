#!/bin/bash

SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
JQ_FILTER_PACKAGES="$SCRIPT_DIR/gen-release-please-config-packages.jq"
JQ_FILTER_CONFIG="$SCRIPT_DIR/gen-release-please-config.jq"


echo "./package.json" $(ls -1 dictionaries/*/package.json) \
    | xargs jq -f $JQ_FILTER_PACKAGES | jq -s add | jq -f $JQ_FILTER_CONFIG > release-please-config.json

pnpm prettier -w r*.json
