---
name: new-dictionary
description: 'Designs and builds a new cspell-dicts dictionary, from interview to one pull request: why and for whom, its name and dictionary IDs, which file types and locales it is enabled for, its sources and their licenses, and how it is built, then the dictionary itself, created with pnpm create-dictionary, with samples and passing checks. Use when the user wants a dictionary for a new programming language, tool, natural language, or field, or asks to "create a dictionary for X". Records the design as ADRs only when the dictionary takes a different approach or needs scripts of its own. For words in an existing dictionary, use word-change. For splitting or renaming existing dictionaries, use feature-adr.'
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

### 2. Name it

Agree on the directory name, which sets the package name and the dictionary ID.

- **Ask** for the directory name, such as `ruby` or `en_AU`. The package name follows from it: `@cspell/dict-<name>`,
  lowercase, with other characters turned into `-`.

### 3. Set up a worktree

Keep the work out of the user's checkout.

- **Do:** create a worktree on a `new-dictionary/<name>` branch, as in `feature-adr` step 3. The design and the
  dictionary go in the same branch and the same PR.

### 4. Design it

Decide everything `pnpm create-dictionary` needs, one decision at a time.

- **Ask** the way `feature-adr` step 5 does: one question at a time, lettered options showing the cspell config a user
  would write, facts checked first, and the user free to defer.
- **Ask,** using `feature-adr`'s `references/interview-guide.md`: group 0 (why, stakeholders, goal), then groups 2 to
  7 (names and IDs, when it's enabled, sources and license, build, samples, release surface).
- **Ask** these too, since the command needs them:
  - **Locale or file type:** a natural language sets the locale, such as `en-AU`. Anything else sets the file type,
    such as `ruby`. Never both `*`.
  - **Description:** the words it covers, such as "Ruby keywords and standard library names".
  - **Contributors:** who creates and maintains it, as "Name (url)". Optional, and published to npm.
  - **Keywords:** other names people search npm for, such as `golang` for Go.
- **Check** each source's license and what it requires: attribution, keeping the license file, or share-alike.
- **Stop and ask** if a license is missing, unclear, or would change the dictionary's license. Give the exact source
  and version, its license, why it matters, and the alternatives.
- **Do:** keep a list of the decisions, one line each, for the PR description.
- **Do:** once the sources and the build are clear, decide whether it needs ADRs, and tell the user why. It needs them
  only when it takes a different approach from the guide, or needs scripts beyond `pnpm create-dictionary`, the build,
  and a `sync` script as in `docs/guides/upstream-updates.md`. If it does, follow `feature-adr` steps 4 to 7, with the
  feature slug `dict-<name>`.

### 5. Settle the design

Build only from a design the user calls final.

- **Stop and ask:** wait until the user says the design is final.
- **Do:** if there are ADRs, squash them into a tight set (`feature-adr` step 9), and commit.

### 6. Create the dictionary

Turn the design into the dictionary with one command.

- **Do:** from the repo root, run it with `--yes` and every decision as an option, so it never prompts:

  ```sh
  pnpm exec create-dictionary --yes <name> <source>... \
    --friendly-name "<Friendly Name>" \
    --description "<the words it covers>" \
    --contributor "<Name> (<url>)" \
    --keyword <search term> \
    --language-id <file type>
  ```

- **Do,** from the design to the options:
  - Every source after the name: word lists and Hunspell `.dic` files alike.
  - `--allow-missing-source` when there's no word list yet. It starts an empty one.
  - One `--contributor` per person, and one `--keyword` per search term.
  - `--locale` for a natural language, or `--language-id` for anything else.
  - `--trie` for Hunspell sources and large lists.
  - `pnpm exec create-dictionary --help` lists every option.
- **If it fails:**
  - On a missing or invalid value, nothing was written. Fix that option and run it again.
  - If `pnpm install` or the build fails, the dictionary was already created. Finish it in its directory
    (`pnpm install`, then `pnpm run build`), or delete it and run the command again.
- **Stop and ask** if the build shows a decision was wrong. Change it with the user, and its ADR if there is one,
  before going on.

### 7. Add what only a person can add

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
- **Do,** leaving these alone:
  - `private: true` and "-- Private until verified" in `package.json`: a maintainer publishes it later.
  - The README's `@@inject` markers: a workflow fills them in after the PR lands.
  - `release-please-config.json` and `.release-please-manifest.json`: a workflow adds the dictionary after the PR
    lands.
  - `@cspell/dict-cspell-bundle`: the cspell repo decides whether to bundle it.

### 8. Run every check

Show that the dictionary builds, passes, and works in cspell.

- **Do,** from the worktree root:

  ```sh
  pnpm install
  pnpm run prepare:dictionaries
  pnpm --filter <package name> test
  pnpm run lint
  ```

- **Check:**
  - After committing, `pnpm run check-dirty` passes: lint left nothing behind.
  - In cspell, as in the guide's step 7 (`cspell link add`), a sample spell checks cleanly. Show the user the result.
- **If it fails:** fix what it reports, and run the checks again until they pass.

### 9. Open one PR

Hand the user one PR with the design and the dictionary.

- **Do:** follow `docs/commits-and-pull-requests.md`:
  - Title: `feat(<name>): add <friendly name> dictionary`.
  - Body: a `## Summary` of what it covers and for whom, a `## Feature` section with the cspell config to enable it,
    the design (one line per decision, linking the feature's `README.md` if there are ADRs), and the sources with
    their licenses.
- **Stop and ask** before pushing, unless the task was to open the PR.

### 10. Clean up after merge

- **Do:** remove the worktree and delete the branch. Change or archive any ADRs from then on with `feature-adr`
  step 10.

## Not this skill

- The "new dictionary" turns out to be words for an existing one. Say so, and offer `word-change`.
- The design changes after merge, or an existing dictionary should be split or renamed. Use `feature-adr`.
