---
name: new-dictionary
description: 'Design and build a new cspell-dicts dictionary package, from interview to one pull request: why and for whom, the package name and dictionary IDs, which file types and locales turn it on, the sources and their licenses, and the build format, then the package itself with sources, samples, README, and passing checks. Decisions are recorded as ADRs only when the dictionary takes a different approach or needs scripts of its own. Use this whenever the user wants to add a dictionary for a new programming language, tool, natural language, or field, or asks to "create a dictionary for X". For words in an existing dictionary use word-change; for splitting or renaming existing dictionaries use feature-adr.'
---

# new-dictionary

Takes a new dictionary package from idea to a single pull request: the design decisions first, then the package built
from them. A dictionary package makes public promises from its first release: its package name, its dictionary IDs,
and the file types and locales it turns on all end up in users' configs. So the design comes first, while it's still
cheap to change.

Most new dictionaries don't need ADRs. They do only when the dictionary takes a different approach from
`docs/guides/new-dictionary.md`, or needs scripts of its own beyond the generator, `cspell-tools-cli build`, and a
`sync` script that follows `docs/guides/upstream-updates.md`.

The interview follows the `feature-adr` skill, and so do the ADRs when they're needed. Read
`.claude/skills/feature-adr/SKILL.md` before starting; this skill refers to its steps rather than repeating them. The
build half follows `docs/guides/new-dictionary.md`; read it too.

## Workflow

1. **Check it doesn't exist.** Look through `dictionaries/`, and run `pnpm exec cspell trace --only-found <word>` from
   the repo root with a few typical words. If an existing dictionary comes close, say so: adding words to it (the
   `word-change` skill) may be the better change.

2. **Name it.** Agree on the directory name, such as `ruby` or `en_AU`. The package name is derived from it by the
   generator: `@cspell/dict-<name>`, lowercase, other characters replaced by `-`. If it needs ADRs, the feature slug
   is `dict-<name>`, so the design lives in `docs/ADRs/dict-<name>/`.

3. **Set up a worktree** on a `new-dictionary/<name>` branch, as in `feature-adr` step 3. The design and the
   package go in the same branch and the same PR.

4. **Design.** Interview one decision at a time.
   - Use `feature-adr`'s `references/interview-guide.md`: group 0 (why, stakeholders, goal), then groups 2–7 (names
     and IDs, when it's on, sources and license, build, samples, release surface).
   - Ask the way `feature-adr` step 5 describes: lettered options showing the cspell config a user would write,
     checking facts before asking, and letting the user defer. Don't invent decisions.
   - Keep a list of the decisions, one line each, for the PR description.
   - **Decide whether it needs ADRs** once the sources and the build are clear, and tell the user why. If it does,
     follow `feature-adr` steps 4–7: bootstrap the ADR directory, write and commit an ADR for each decision made so
     far and each one after, and keep the glossary in sync.
   - **Review licenses before choosing sources.** For each source, check its license and what it requires (attribution,
     keeping the license file, share-alike). Record the result with the decisions, and in the sources ADR if there is
     one. If a license is missing, unclear, or would force the package's license to change, stop and tell the user: the
     exact source and version, its license, why it matters, and the alternatives. Never assume it's fine.

5. **Settle the design before building.** Wait until the user says the design is final. If there are ADRs, squash them
   into a tight set (`feature-adr` step 9) and commit. The package is built from the design. If the build shows a
   decision was wrong, stop, change it with the user (and its ADR, if there is one), and then continue.

6. **Build the package.** Follow `docs/guides/new-dictionary.md` from step 4. The rules below are the ones most easily
   missed.
   - Run the generator from the repo root: `pnpm run create-dictionary <name> <path/to/source/words>`. It prompts
     interactively; answer from the design.
   - `cspell-ext.json`'s `dictionaryDefinitions` and `languageSettings` match the design exactly: IDs, `languageId`,
     `locale`.
   - `package.json`: add `keywords`, and check that `files` lists every built file and upstream license file. Leave
     `private: true` and "-- Private until verified" in `description`: a maintainer makes the package public in a later
     PR (`docs/releasing.md`, "New packages").
   - An upstream source gets a `sync` script, as in `docs/guides/upstream-updates.md`. Never hand-edit synced files.
   - `samples/` holds correctly spelled files of the kind the dictionary is for, and the `test` script checks them.
     Include text that must still be flagged only if the test can assert it.
   - The README is for someone installing the dictionary, with absolute `https://` links. Keep the template's
     `@@inject` markers; a workflow fills them in after the PR lands.
   - Never add the package to `.release-please-manifest.json`. `pnpm run lint` adds it to `release-please-config.json`.
   - Don't add it to `@cspell/dict-cspell-bundle`. A maintainer decides that when making the package public.

7. **Run every check** from the worktree root:

   ```sh
   pnpm install
   pnpm run prepare:dictionaries
   pnpm --filter <package name> test
   pnpm run lint
   pnpm run check-dirty   # after committing: lint left nothing behind
   ```

   Then try it as in the guide's step 7 (`cspell link add`), and show the user the result on a sample.

8. **Open one PR** with the package, after the ADR commits if there are any. Use a
   `feat(<name>): add <friendly name> dictionary` title. The body has a `## Summary` of what the dictionary covers and
   for whom, a `## Feature` section with the cspell config to turn it on, then the design (one line per decision,
   linking to the feature's `README.md` if there are ADRs), the sources with their licenses, and the checks that ran.
   Push only when the user asks, or when the task was to open the PR.

9. **After merge,** remove the worktree and delete the branch. If there are ADRs, change or archive them from then on
   with `feature-adr` (step 10).

## Notes

- If the "new dictionary" turns out to be words for an existing one, stop and say so, and offer `word-change`.
- Don't let the build quietly change the design. A decision that doesn't survive contact with the build goes back to
  the user before the PR, and its ADR is updated if it has one.
