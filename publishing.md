# Publishing

To publish packages:

```
yarn pub
```

## Recovering Failed Publish Step

Sometimes lerna will fail during the publishing step. This is very annoying and can be a pain to fix.

### Steps:

1. Address the reason the publication failed.
1. If possible, attempt to republish: `yarn pub`.
1. Try force publishing: `yarn force-publish`. This will skip the lerna publish step and call `npm` directly.

### Re-publish missing packages

Lerna sucks when things go wrong. It can happen that not all packages were published, but Lerna will refuse to try again
because nothing has changed since it last tried to publish.

Force publish:

```
yarn force-publish
```
