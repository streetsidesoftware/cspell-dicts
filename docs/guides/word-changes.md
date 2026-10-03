# Adding, removing, or fixing words

<!--
audience: technical contributor
kind: guide
level: comfortable with basic git and a terminal; doesn't read or write code
-->

> [!NOTE]
> For contributors who can fork the repo and follow terminal steps. No coding needed.

How to change the words in an existing dictionary in a clone of the repo. To add a whole new dictionary, see
[Creating a dictionary](./new-dictionary.md). To update words that come from an upstream source, see
[Upstream updates](./upstream-updates.md).

> [!TIP]
> Changing a few words? You can do it on GitHub, with no setup: see
> [Changing words in your browser](./word-changes-in-browser.md).

It is fine to change several words in one PR, as long as they are related: the same dictionary, or the same concept.

## 1. Set up

Check the [prerequisites](../repository.md#prerequisites), then:

```sh
pnpm install
pnpm run prepare:dictionaries
```

## 2. Find the dictionary and the file

Pick them as described in [Where words go](../word-lists.md#where-words-go).

To see which dictionaries already have a word, run this from the repo root:

```sh
pnpm exec cspell trace --only-found <word>
```

## 3. Edit the words

Follow the [format](../word-lists.md#format). To remove a word, see [Removing a word](../word-lists.md#removing-a-word).

## 4. Sort, build, and test

From the repo root:

```sh
pnpm run sort
```

Then in the dictionary's directory:

```sh
pnpm run build
pnpm test
```

Checks:

- `dict/` (or the `.trie` file) changed the way you expected, and nothing else did.
- `pnpm test` passes.
- If other dictionaries read this dictionary's files (see
  [Using another package's files](../dictionary-packages.md#using-another-packages-files)), build and test them too.
  For example, after changing `en_shared`, build the English dictionaries.

## 5. Commit and open a PR

- Commit the `src/` change and the rebuilt `dict/` together.
- Use `fix:` with the dictionary's directory as scope, such as `fix(companies): add Sourcegraph`. A new domain of words
  is `feat:`. See [Commits and pull requests](../commits-and-pull-requests.md).
- In the PR, say which words changed and why, with a source for words that aren't obvious.
