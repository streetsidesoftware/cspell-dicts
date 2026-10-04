---
name: new-dictionary
description: 'Designs and builds a new cspell-dicts dictionary, from interview to one pull request: why and for whom, its name and dictionary IDs, which file types and locales it is enabled for, its sources and their licenses, and how it is built, then the dictionary itself, created with pnpm create-dictionary, with samples and passing checks. Use when the user wants a dictionary for a new programming language, tool, natural language, or field, or asks to "create a dictionary for X". For words in an existing dictionary, use word-change. For splitting or renaming existing dictionaries, use feature-adr.'
---

# new-dictionary

Takes a new dictionary from idea to one pull request: the design first, while it's cheap to change, then the dictionary
built from it. Its name, dictionary IDs, and the file types and locales it's enabled for end up in users' configs from
its first release. Read `docs/guides/new-dictionary.md` and `.claude/skills/feature-adr/SKILL.md` first: this skill
uses the guide for the build and `feature-adr`'s interview for the design.

## Workflow

### 1. Check it doesn't exist

Make sure a new dictionary is the right change.

- **Do:** look through `dictionaries/`, and from the repo root run this with a few typical words:

  ```sh
  pnpm exec cspell trace --only-found <word>
  ```

- **Stop and ask** if an existing dictionary comes close: adding words to it with `word-change` may be the better
  change.

### 2. Name it, and set up a worktree

Agree on the directory name, which sets the package name and the dictionary ID, and keep the work out of the user's
checkout.

- **Ask** for the directory name, such as `ruby` or `en_AU`. The package name follows from it: `@cspell/dict-<name>`,
  lowercase, with other characters turned into `-`.
- **Do,** in the main checkout (the first path `git worktree list` prints). The design and the dictionary go in this
  branch and one PR:

  ```sh
  git fetch origin main
  git worktree add -b new-dictionary/<name> .claude/worktrees/new-dictionary-<name> origin/main
  ```

### 3. Design it

Decide everything `pnpm create-dictionary` needs, one decision at a time.

- **Ask** the way `feature-adr` step 5 does: one question at a time, lettered options showing the cspell config a user
  would write, facts checked first, and the user free to defer.
- **Ask,** using `feature-adr`'s `references/interview-guide.md`: group 0 (why, stakeholders, goal), then groups 2 to
  7 (names and IDs, when it's enabled, sources and license, build, samples, release surface).
- **Ask** these too, since the command needs them:
  - **Locale or file type:** a natural language sets the locale, such as `en-AU`. Anything else sets the file type,
    such as `ruby`, a [VS Code language ID](https://code.visualstudio.com/docs/languages/identifiers). Never both
    `*`.
  - **Description:** the words it covers, such as "Ruby keywords and standard library names".
  - **Contributors:** who creates and maintains it, as "Name (url)". Optional, and published to npm.
  - **Keywords:** other names people search npm for, such as `golang` for Go.
  - **Sources:** if a file the user named doesn't exist, ask for the right path, or whether to start empty.
- **Check** each source's license and what it requires: attribution, keeping the license file, or share-alike.
- **Stop and ask** if a license is missing, unclear, or would change the dictionary's license. Give the exact source
  and version, its license, why it matters, and the alternatives.
- **Do:** keep the answers to group 0 and a list of the decisions, one line each, for the PR description.
- **Stop and ask** if the design goes beyond the guide: a different approach, or scripts beyond
  `pnpm create-dictionary`, the build, and a `sync` script as in `docs/guides/upstream-updates.md`. Suggest settling
  that design first with `feature-adr`, as its own step, before building the dictionary.
- **Stop and ask:** wait until the user says the design is final.

### 4. Create the dictionary

Turn the design into the dictionary with one command.

- **Do:** from the worktree's root, prepare the workspace, then run the command with `--yes` and every decision as an
  option, so it never prompts:

  ```sh
  pnpm install
  pnpm run prepare:dictionaries
  pnpm exec create-dictionary --yes <name> <source>... \
    --friendly-name "<Friendly Name>" \
    --description "<the words it covers>" \
    --contributor "<Name> (<url>)" \
    --keyword <search term> \
    --language-id <file type>
  ```

- **Do,** from the design to the options:
  - `--allow-missing-source` when there's no word list yet. It starts an empty one.
  - One `--contributor` per person, and one `--keyword` per search term.
  - `--locale` for a natural language, or `--language-id` for anything else.
  - `--trie` for Hunspell sources and large lists.
  - A source someone else maintains: `--define-source` and `--add-source-*`, as in the guide's "Third-party sources".
- **If it fails:**
  - On a missing or invalid value, nothing was written. Fix that option and run it again.
  - If `pnpm install` or the build fails, the dictionary was already created. Finish it in its directory
    (`pnpm install`, then `pnpm run build`), or delete it and run the command again.
- **Stop and ask** if the build shows a decision was wrong. Change it with the user before going on.

### 5. Add what only a person can add

Finish what the command can't know.

- **Do:**
  - Add a few correctly spelled files of the kind the dictionary is for to `samples/`.
  - Add `"test:samples": "cspell samples"` to `package.json`'s scripts, and run it from `test`. The template doesn't
    check samples yet.
  - Write the README's description: what the dictionary covers and why to use it, with absolute `https://` links.
  - For an upstream source, add a `sync` script as in `docs/guides/upstream-updates.md`. Never edit synced files by
    hand.
- **Check:**
  - `cspell-ext.json`'s `dictionaryDefinitions` and `languageSettings` match the design: the IDs, `languageId`, and
    `locale`.
  - `package.json`'s `files` lists every built file and every upstream license file.
- **Do:** leave `private: true`, the README's `@@inject` markers, the Release Please files, and
  `@cspell/dict-cspell-bundle` alone. Maintainers and workflows handle them after the PR lands, as the guide says.

### 6. Run every check

Show that the dictionary builds, passes, and works in cspell.

- **Do,** from the worktree's root, then commit the dictionary with the PR's title as the message:

  ```sh
  pnpm --filter <package name> test
  pnpm run lint
  ```

- **Check:**
  - After committing, `pnpm run check-dirty` passes: lint left nothing behind.
  - In cspell, as in the guide's step 7 (`cspell link add`), a sample spell checks cleanly. Show the user the result.
- **If it fails:** fix what it reports, and run the checks again until they pass.

### 7. Open one PR

Hand the user one PR with the design and the dictionary.

- **Do:** follow `docs/commits-and-pull-requests.md`:
  - Title: `feat(<name>): add <friendly name> dictionary`.
  - Body: a `## Summary` of what it covers and for whom, a `## Feature` section with the cspell config to enable it,
    the design (one line per decision), and the sources with their licenses.
- **Stop and ask** before pushing or opening the PR.
- **Do,** after merge: remove the worktree and delete the branch.

## Not this skill

- The "new dictionary" turns out to be words for an existing one. Say so, and offer `word-change`.
- The design changes after merge, or an existing dictionary should be split or renamed. Use `feature-adr`.
