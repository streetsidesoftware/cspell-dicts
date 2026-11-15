---
name: new-dictionary
description: 'Helps the user build a new cspell-dicts dictionary for their purpose, from idea to one pull request: a natural language, the terminology of a field, a programming language, or a software ecosystem. Proposes a design from the usual answers for that kind (name, dictionary IDs, when it is enabled, sources and their licenses), then creates the dictionary with pnpm create-dictionary, with samples and passing checks. Use when the user wants a dictionary for a new programming language, tool, framework, natural language, or field, or asks to "create a dictionary for X". For words in an existing dictionary, use word-change. For splitting or renaming existing dictionaries, use feature-design.'
---

# new-dictionary

Helps the user build a dictionary for their purpose, and makes it easy. The user knows what the words are for. This
skill brings the usual answers for that kind of dictionary, and the commands. Read `docs/guides/new-dictionary.md`
first: its step 1 describes the four kinds and their usual answers, and the rest of it is the build.

## Workflow

### 1. Learn the purpose

Find out what the dictionary is for, and which kind it is.

- **Ask** what the words are, who writes them, and where they come from, unless the user already said.
- **Do:** match it to a kind in the guide's step 1, and read one of that kind's example dictionaries. Its
  `cspell-ext.json`, `package.json`, and `src/` show the patterns to follow.
- **Do:** search issues and PRs in cspell-dicts and cspell. Someone may have asked for it, started it, or added its
  file types to cspell. For code, check that cspell knows its extensions, as the guide says.
- **Do:** treat related dictionaries as examples. Sharing words with them is normal. To find them, run `cspell trace`
  after `pnpm run prepare:dictionaries`. "Dictionary Errors." means some failed to load, and the result is incomplete.

### 2. Set up a worktree

Keep the work out of the user's checkout.

- **Do:** if this session already runs in a worktree, work there on a branch from a fresh `origin/main`. Otherwise,
  in the main checkout (the first path `git worktree list` prints), make one. The design and the dictionary go in this
  branch and one PR:

  ```sh
  git fetch origin main
  git worktree add -b new-dictionary/<name> .claude/worktrees/new-dictionary-<name> origin/main
  ```

### 3. Propose the design

Turn the purpose into everything `pnpm create-dictionary` needs, starting from the kind's usual answers.

- **Ask** with one proposal: the whole design in one message, each choice with its usual answer and a short reason.
  Then ask only about what has no clear answer, such as the sources and the scope. The proposal covers:
  - **Name:** the directory name, such as `ruby` or `en_AU`. The package name follows from it: `@cspell/dict-<name>`,
    lowercase, with other characters turned into `-`.
  - **When it's enabled:** the locale for a natural language, such as `en-AU`, or the file types for code, such as
    `ruby` ([VS Code language IDs](https://code.visualstudio.com/docs/languages/identifiers)). Or not until users enable
    it. Never both `*`.
  - **Sources:** where the words come from, and what each option costs to build and maintain, as
    `docs/design-questions.md` asks. If a file the user named doesn't exist, ask for the right path, or whether to start
    empty.
  - **Description:** the words it covers, such as "Ruby keywords and standard library names".
  - **Keywords:** other terms people search npm for, such as `golang` for Go.
  - **Contributors:** who creates and maintains it, as "Name (url)". Optional, and published to npm.
  - **Samples:** what the kind uses, from the guide.
- **Check** each source's license and what it requires: attribution, keeping the license file, or share-alike.
- **Stop and ask** if a license is missing, unclear, or would change the dictionary's license. Give the exact source
  and version, its license, why it matters, and the alternatives.
- **Ask:** if the dictionary fits no kind, or needs scripts beyond `pnpm create-dictionary`, the build, and a `sync`
  script as in `docs/guides/upstream-updates.md`, offer to settle that part first with `feature-design`.
- **Do:** keep the purpose and a list of the decisions, one line each, for the PR description.
- **Stop and ask:** build once the user agrees with the design.

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
  - `--placeholder-word-lists` when there's no word list yet. It starts an empty one.
  - One `--contributor` per person, and one `--keyword` per search term.
  - `--locale` for a natural language, or `--language-id` for a programming language or file type.
  - For a dictionary users enable themselves, `--no-language-settings`. For one enabled for every file, only when the
    design says so, `--enable-for-all-files`.
  - One `--add-sample` per real sample the user has, each with `--add-sample-origin` and `--add-sample-license`.
  - Leave the trie and the build to their defaults. With a Hunspell source, it doesn't build: run `pnpm run build` in
    the dictionary's directory. If that's too slow, lower `maxDepth` in `cspell-tools.config.yaml`, and tell the user.
  - A source someone else maintains: `--define-source` and `--add-source-*`, as in the guide's "Third-party sources".
- **If it fails:**
  - On a missing or invalid value, nothing was written. Fix that option and run it again.
  - If `pnpm install` or the build fails, the dictionary was already created. Finish it in its directory
    (`pnpm install`, then `pnpm run build`), or delete it and run the command again.
- **Stop and ask** if the build shows a decision was wrong. Change it with the user before going on.

### 5. Add what only a person can add

Finish what the command can't know.

- **Do:**
  - If the command got no `--add-sample`, add a few correctly spelled files of the kind the dictionary is for. In the
    dictionary's folder, run `pnpm exec add-samples --add-sample <path> --add-sample-origin <file>=<origin>
--add-sample-license <file>=<license>`, which copies them into `samples/` and lists them in
    `samples/sample-sources.csv`. For a natural language, the command fetches
    `samples/seattle.md` itself, when it can reach Wikipedia. Add other neutral articles with
    `--add-wikipedia-sample <title or link>`, to either command.
  - Keep samples on a neutral subject, as `docs/dictionary-packages.md` says: nothing political or ideological, and no
    contested city.
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
  - In cspell, as in the guide's step 7, a sample spell checks cleanly. Show the user the result.
  - For a file type, the dictionary is enabled for each extension, uppercase too, as the guide's step 7 checks. Fix a
    missing one with `overrides` in `cspell-ext.json`, never in `samples/cspell.json`.
  - A few lines of real code spell check cleanly, not only the source's own words.
- **If it fails:** fix what it reports, and run the checks again until they pass. For a word a sample uses that the
  dictionary lacks: add a real word to `src/additional_words.txt` and build again, and a name or an identifier to
  `words` in `samples/cspell.json`. Ask the user when it's unclear which it is.

### 7. Open one PR

Hand the user one PR with the design and the dictionary.

- **Do:** follow `docs/commits-and-pull-requests.md`:
  - Title: `feat(<name>): add <friendly name> dictionary`.
  - Body: a `## Summary` of what it covers and for whom, a `## Feature` section with the cspell config to enable it,
    the design (one line per decision), and the sources with their licenses.
- **Stop and ask** before pushing or opening the PR.
- **Do,** after merge: remove the worktree and delete the branch.

## Not this skill

- The design changes after merge, or an existing dictionary should be split or renamed. Use `feature-design`.
