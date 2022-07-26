# Publishing

To publish packages:

Merge the Pull Request [chore: release main](https://github.com/streetsidesoftware/cspell-dicts/pulls?q=is%3Apr+is%3Aopen+chore+release+main).
This will automatically build and publish all changed dictionaries.

## Recovering Failed Publish Step

Sometimes lerna will fail during the publishing step. This is very annoying and can be a pain to fix.

### Steps:

1. Address the reason the publication failed.
1. Run action: Publish
1. If necessary, try force publishing: `yarn force-publish`. This will skip the lerna publish step and call `npm` directly.
