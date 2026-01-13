#
# This is a development script to link cspell packages into the repo.
# It is not intended for general use.
#
# It is useful to see how changes to cspell packages affect the dictionaries.
#
# Use from the root of the cspell-dicts repo.
#
# The cspell repo should be located at ../cspell
#

pnpm link ../cspell/packages/cspell-tools
pnpm link ../cspell/packages/cspell
pnpm link ../cspell/packages/cspell-dictionary
pnpm link ../cspell/packages/cspell-io
pnpm link ../cspell/packages/cspell-trie
pnpm link ../cspell/packages/cspell-trie-lib
pnpm link ../cspell/packages/cspell-types
pnpm link ../cspell/packages/hunspell-reader
pnpm i --force
git checkout dictionaries && pnpm run setup-repo
