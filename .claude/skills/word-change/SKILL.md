---
name: word-change
description: 'Add, remove, or correct words in an existing cspell-dicts dictionary end to end: find the right dictionary and source file, edit the word list, sort, rebuild the package and any package that reads from it, test, and draft the commit message and PR description. Use this whenever the user asks to add a word, allow a term, stop flagging something, remove a misspelling, fix capitalization, or move a word between dictionaries, even if they do not say "skill" or name a dictionary. Do not use it for a new dictionary package (use new-dictionary), for words that come from an upstream source like a Hunspell file (use upstream-update, or exclude them as described here), or for splitting or renaming dictionaries (use feature-adr).'
---

# word-change

Changes words in an existing dictionary by following `docs/guides/word-changes.md`. Read that guide first: it is the
procedure and holds the word format. This skill adds the questions to settle, the checks, and the drafts.

## Workflow

### 1. Settle what changes

Ask, if it isn't clear:

- Which words, and add, remove, or correct?
- What are they: a programming or tool term, a name (company, product, place), or a word of a natural language?
- For a natural language word: which variants is it valid in (for English: every variant, or only `en_US`, `en_GB`,
  ...)?
- Where does it come from? Ask for a source (documentation, a dictionary, a project's website) when it isn't obvious.
  The PR needs it.

If several unrelated words are asked for, suggest one PR per dictionary or concept.

### 2. Find where each word goes

Run from the repo root, after `pnpm install` and `pnpm run prepare:dictionaries`:

```sh
pnpm exec cspell trace --only-found <word>
```

- It shows which dictionaries already have the word. For an addition, that may mean it's already covered, or that the
  user's config doesn't turn that dictionary on. Say so before adding anything.
- For a removal, it shows every dictionary the word must leave.

Pick the dictionary and file by the guide's "Find the dictionary" and "Find the source file", and read the package's
`cspell-tools.config.yaml`. Propose the file for each word, with the reason, and confirm with the user when more than
one fits.

### 3. Edit

- Follow the guide's format: case, one entry per line, `#` comments, regional spellings.
- Match the file's existing conventions, such as how it groups or comments words.
- To remove a word that comes from upstream, add it to the target's `excludeWordsFrom` file. If the target has none, stop
  and tell the user: adding one is a design choice.
- Never edit `dict/`, `.trie` files, or synced upstream files.

### 4. Sort, build, and test

```sh
pnpm run sort
cd dictionaries/<name>
pnpm run build
pnpm test
```

- Check `git diff` in `dict/`: only the expected words changed.
- Find packages that read this package's files (`grep -l "<name>/" dictionaries/*/cspell-tools.config.yaml`, and
  workspace dependencies such as `@cspell/dict-en-shared`). Build and test them too, and include their changed
  `dict/` files.
- Check the words now behave as asked: `pnpm exec cspell trace --only-found <word>` from the repo root.
- Run `pnpm run lint` from the repo root.

### 5. Draft the commit message and PR description

- **Type and scope:** see `docs/commits-and-pull-requests.md`. A word change is usually `fix(<package>): …`, such as
  `fix(companies): add Sourcegraph`.
- **Description:** fill in `.github/pull_request_template.md`: a `## Summary`, the dictionary, and the words with their
  sources.

Show the drafts to the user. Don't commit, push, or open a PR until they say so.

## Notes

- If the user's real problem is their own config (a dictionary not turned on, a missing `language` or locale), say so:
  the fix may not belong in this repo.
- If a word's placement shows a dictionary should be split or its settings changed, stop and offer `feature-adr`.
