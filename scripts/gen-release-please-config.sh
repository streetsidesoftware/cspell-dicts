#!/bin/bash

SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
JQ_FILTER_PACKAGES="$SCRIPT_DIR/gen-release-please-config-packages.jq"


echo "./package.json" $(find -s ./dictionaries -name "package.json" -depth 2) \
    | xargs jq -f $JQ_FILTER_PACKAGES | jq -s add | jq "{
        \"bootstrap-sha\": \"8ddc057b66a16f494aae11b38ee0256ff55c52ec\",
        \"include-v-in-tag\": false,
        \"tag-separator\": \"@\",
        packages: .
    }" > release-please-config.json
