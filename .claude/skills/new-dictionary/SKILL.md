---
name: new-dictionary
description: 'Design and build a new cspell-dicts dictionary package, from interview to one pull request: why and for whom, the package name and dictionary IDs, which file types and locales turn it on, the sources and their licenses, and the build format, recorded as ADRs, then the package itself with sources, samples, README, and passing checks. Use this whenever the user wants to add a dictionary for a new programming language, tool, natural language, or field, or asks to "create a dictionary for X". For words in an existing dictionary use word-change; for splitting or renaming existing dictionaries use feature-adr.'
---

# new-dictionary

Takes a new dictionary package from idea to a single pull request: the design decisions first, as ADRs, then the
package built against them. A dictionary package makes public promises from its first release: its package name, its
dictionary IDs, and the file types and locales it turns on all end up in users' configs. So the design comes first,
while it's still cheap to change.

The design half is the `feature-adr` skill's process. Read `.claude/skills/feature-adr/SKILL.md` before starting; this
skill refers to its steps rather than repeating them. The build half follows `docs/guides/new-dictionary.md`; read it
too.

## Workflow

1. **Check it doesn't exist.** Look through `dictionaries/`, and run `pnpm exec cspell trace --only-found <word>` from
   the repo root with a few typical words. If an existing dictionary comes close, say so: adding words to it (the
   `word-change` skill) may be the better change.

2. **Name it.** Agree on the directory name, such as `ruby` or `en_AU`. The package name is derived from it by the
   generator: `@cspell/dict-<name>`, lowercase, other characters replaced by `-`. The ADR feature slug is
   `dict-<name>`, so the design lives in `docs/ADRs/dict-<name>/`.

3. **Set up a worktree** on a `claude-new-dictionary-<name>` branch, as in `feature-adr` step 3. The design and the
   package go in the same branch and the same PR.

4. **Design.** Follow `feature-adr` steps 4–7: bootstrap the ADR directory, then interview one decision at a time,
   writing and committing one ADR per decision and keeping the glossary in sync.
   - Use `feature-adr`'s `references/interview-guide.md`: group 0 (why, stakeholders, goal), then groups 2–7 (names
     and IDs, when it's on, sources and license, build, samples, release surface).
   - Ask the way `feature-adr` step 5 describes: lettered options showing the cspell config a user would write,
     checking facts before asking, and letting the user defer.
   - A simple dictionary, such as a keyword list for one language turned on for its file type, may need only one or
     two ADRs. Don't invent decisions.
   - **Review licenses before choosing sources.** For each source, check its license and what it requires (attribution,
     keeping the license file, share-alike). Record the result in the sources ADR. If a license is missing, unclear, or
     would force the package's license to change, stop and tell the user: the exact source and version, its license,
     why it matters, and the alternatives. Never assume it's fine.

5. **Finalize the design before building.** Once the user says the design is final, squash the ADRs into a tight set
   (`feature-adr` step 9) and commit. The package is built against these ADRs. If the build shows a decision was wrong,
   stop, update the ADR with the user, and then continue.

6. **Build the package.** Follow `docs/guides/new-dictionary.md` from step 4. The rules below are the ones most easily
   missed.
   - Run the generator from the repo root: `pnpm run create-dictionary <name> <path/to/source/words>`. It prompts
     interactively; answer from the design.
   - `cspell-ext.json`'s `dictionaryDefinitions` and `languageSettings` match the ADRs exactly: IDs, `languageId`,
     `locale`.
   - `package.json`: remove "-- Private until verified" from `description`, add `keywords`, check `files` lists every
     built file and upstream license file, then run `pnpm update-package-json dictionaries/<name>/package.json` from
     the repo root.
   - An upstream source gets a `sync` script, as in `docs/guides/upstream-updates.md`. Never hand-edit synced files.
   - `samples/` holds correctly spelled files of the kind the dictionary is for, and the `test` script checks them.
     Include text that must still be flagged only if the test can assert it.
   - The README is for someone installing the dictionary, with absolute `https://` links. Keep the template's
     `@@inject` markers; `pnpm run build:readme` fills them.
   - Leave `private: true` until the user says the package is ready to publish, then set it to `false`.
   - Never add the package to `.release-please-manifest.json`. Run `./scripts/gen-release-please-config.sh` only if
     the user wants it in the release config before the next Update Dependencies run.
   - Add it to `@cspell/dict-cspell-bundle` only if the design says so.

7. **Run every check** from the worktree root:

   ```sh
   pnpm install
   pnpm run prepare:dictionaries
   pnpm --filter <package name> test
   pnpm run build:readme
   pnpm run lint
   pnpm run check-dirty   # after committing: build:readme and lint left nothing behind
   ```

   Then try it as in the guide's step 7 (`cspell link add`), and show the user the result on a sample.

8. **Open one PR** with the ADR commits followed by the package. Use a `feat(<name>): add <friendly name> dictionary`
   title. The body has a `## Summary` of what the dictionary covers and for whom, a `## Feature` section with the
   cspell config to turn it on, then the design (one line per ADR, linking to the feature's `README.md`), the sources
   with their licenses, and the checks that ran. Push only when the user asks, or when the task was to open the PR.

9. **After merge,** remove the worktree and delete the branch. From then on, amend or archive the ADRs with
   `feature-adr` (step 10).

## Notes

- If the "new dictionary" turns out to be words for an existing one, stop and say so, and offer `word-change`.
- Don't let the build quietly change the design. A decision that doesn't survive contact with the build goes back to
  the user, and its ADR is updated before the PR.
