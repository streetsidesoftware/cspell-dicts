#!/bin/sh

rm -rf temp
mkdir -p temp/python/cpython
git clone --single-branch --depth 1 https://github.com/python/cpython.git temp/python/cpython
python scripts/extractLib.py > src/python-lib.txt
