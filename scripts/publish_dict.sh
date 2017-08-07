#!/bin/bash

echo "Publish $1"
cd "$1" && npm run publish-patch
echo Done.
