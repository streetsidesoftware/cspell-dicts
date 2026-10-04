---
name: word-change
description: 'Adds, removes, or corrects words in an existing cspell-dicts dictionary: finds the dictionary and source file, edits the word list, sorts, rebuilds it and the dictionaries that read from it, tests, and drafts the commit message and PR description. Use when the user wants to add a word, allow a term, stop a word from being flagged, remove a misspelling, fix capitalization, or move a word between dictionaries, even without naming a dictionary. For a new dictionary, use new-dictionary. For words from an upstream source, use upstream-update. For splitting or renaming dictionaries, use feature-adr.'
---

# word-change

Changes the words in an existing dictionary. Read `docs/guides/word-changes.md` (the procedure) and `docs/word-lists.md`
(where words go, and their format) first.

## Workflow

### 1. Settle what changes

Know which words change, how, and where they come from.

- **Ask,** when it isn't clear:
  - Which words, and are they added, removed, or corrected?
  - What kind of word: a programming or tool term, a name, or a word of a natural language?
  - For a natural language word: which variants it's valid in, such as every English variant or only `en_US`.
  - Where it comes from: documentation, a dictionary, or a project's website. The PR needs a source.
- **Do:** suggest one PR per dictionary or topic when the words are unrelated.

### 2. Find where each word goes

Pick one dictionary and one source file for each word.

- **Do:** from the repo root, after `pnpm install` and `pnpm run prepare:dictionaries`:

  ```sh
  pnpm exec cspell trace --only-found <word>
  ```

- **Check** what `trace` shows:
  - Adding a word that a dictionary already has: tell the user before adding anything. Their config may not enable
    that dictionary, or their cspell may bundle an older version. `git log -S <word> -- dictionaries/<name>/src` shows
    when it was added.
  - Removing a word: every dictionary it must leave.
- **Do:** pick the file by "Where words go" in `docs/word-lists.md`, the dictionary's `src/README.md`, and the header
  comments of its source files. Most new words go in `src/additional_words.txt`, when the dictionary has one.
- **Check:** the dictionary's build reads the file you picked: its `cspell-tools.config.yaml`, or for the few without
  one, the `build` script in its `package.json`.
- **Stop and ask** when more than one file fits. Propose each word's file, with the reason.

### 3. Edit the word lists

Change only the source files.

- **Do:**
  - Follow the format in `docs/word-lists.md`: case, one entry per line, `#` comments, and regional spellings.
  - Match the file's existing grouping and comments.
  - Never edit `dict/`, `.trie` files, or synced upstream files.
  - To remove a word that comes from upstream, add it to the target's `excludeWordsFrom` file.
- **Stop and ask** if the target has no `excludeWordsFrom` file: adding one is a design choice.

### 4. Build and test

Rebuild every dictionary the change reaches, and show that the words behave as asked.

- **Do:**

  ```sh
  pnpm run sort
  cd dictionaries/<name>
  pnpm run build
  pnpm test
  ```

- **Do:** build and test every dictionary that reads this one's files, and include their changed `dict/` files. Find
  them with this, and through workspace dependencies such as `@cspell/dict-en-shared`:

  ```sh
  grep -l "<name>/" dictionaries/*/cspell-tools.config.yaml dictionaries/*/package.json
  ```

- **Check:**
  - `git diff` in `dict/` shows only the expected words.
  - `pnpm exec cspell trace --only-found <word>`, from the repo root, shows each word where it should be.
  - `pnpm run lint`, from the repo root, passes.
- **If it fails:** fix what it reports, and run the checks again until they pass.

### 5. Draft the commit message and PR description

Give the user drafts to approve.

- **Do:**
  - Type and scope as in `docs/commits-and-pull-requests.md`, usually `fix(<dictionary>): add <word>`.
  - Fill in `.github/pull_request_template.md`: the summary, the dictionary, and each word with its source.
- **Stop and ask** before committing, pushing, or opening a PR.

## Not this skill

- The user's own config is the problem, such as a dictionary that isn't enabled, or a missing `language` or locale. Say
  so: the fix may not belong in this repo.
- A word's placement shows a dictionary should be split or its settings changed. Offer `feature-adr`.
