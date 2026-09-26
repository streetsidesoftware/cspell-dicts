# Commits and pull requests

## Who reads the release notes

Release Please builds each package's version bump and `CHANGELOG.md` from commit types (see [Releasing](./releasing.md)).
Most people get these dictionaries through cspell and the Code Spell Checker extension, which bundle many of them. A
new version here flows into cspell's own updates. The changelog is read by cspell's maintainers and users, who want to
know one thing: will this change what gets flagged in my files?

Pick the type by that reader, not by how large the diff is.

## Commit types

Follow [Conventional Commits](https://www.conventionalcommits.org/). PRs are squash-merged, so the PR title becomes the
commit message.

- `feat:`: something new users can turn on or rely on:
  - a new dictionary package
  - a new dictionary ID, or a new setting in a package's `cspell-ext.json`
  - a new domain of words: a coherent new set, such as the environment variables of a tool, not just many words
- `fix:`: any other change to what a dictionary accepts or flags:
  - adding, removing, or correcting words
  - fixing a pattern or a `languageSettings` entry
  - rebuilding from an updated upstream source
- `feat!:` or `fix!:`: either of the above, when an existing setup starts flagging text it accepted before, or stops
  working. For example:
  - moving words into a new dictionary ID that isn't enabled by default
  - removing or renaming a dictionary ID
  - a license change

  Removing a genuine misspelling is a plain `fix:`, even though users may see new issues: finding them is the point.

- `perf:`: a change users would notice as faster, with no change in what gets flagged.
- `revert:`: undoes a merged commit.
- `docs:`: documentation only, including README text outside a package's words or settings.
- `chore:`: everything else that doesn't change a published dictionary: repo tooling, scripts, the generator, lint
  config, Claude Code skills and settings.
- `ci:`: GitHub Actions and workflows, and dependency updates.
- `refactor:`, `style:`, `test:`, `build:`: internal changes of those kinds, with no change in what gets flagged.

The bot PRs set their own types. Don't change them:

- "Update Dictionaries" and "Build Dictionaries" are `fix:`, since they change dictionary content.
- "Update ALL Dependencies" and Dependabot PRs are `ci:`.
- "Update README.md" is `chore:`.

### Which types show in the changelog

`changelog-sections` in `scripts/gen-release-please-config.jq` decides this.

- **Shown:** `feat`, `fix`, `perf`, `revert`, `refactor`, `style`, `test`, `build`, and commits with no type.
- **Hidden:** `chore`, `docs`, `ci`.

If a PR merged under the wrong type, see [Releasing](./releasing.md#fixing-a-changelog-entry-after-merge).

## Scopes

A scope is optional. When a change is to one package, use the package's directory name under `dictionaries/`:

- `fix(en_US): remove "strate"`
- `fix(software-terms): add worktree`
- `feat(python): add pip environment variables`

Use the directory name, not a dictionary ID: one package can define several IDs, such as `python` and
`python-common`. When a change spans packages, leave the scope out and name the packages in the subject.

Each package's changelog is correct without a scope, because Release Please assigns commits by the files they change.
The scope helps readers of the release PR, which lists every package.

## Subjects

Write the subject of a `feat:` or `fix:` commit for a user: which words or which behavior changed, and in which
dictionary if there is no scope. For example, `fix(companies): add Sourcegraph`, not `fix: update companies.txt`.

## Pull request descriptions

Keep them short. Prefer bullet points over prose. A sentence with more than one or two `code` spans is hard to read:
break it into a list.

- `## Summary`: one or two sentences that stand on their own: what changed and why.
- `feat:` and `fix:` PRs are read by users deciding whether a change affects them.
  - Say which dictionary and which words or settings changed.
  - Give a source for added words when it isn't obvious: documentation, a dictionary, or a project's website.
  - For `feat:`, add a `## Feature` section: what users can now do, and how to turn it on if it isn't on by default.
- `chore:` and `refactor:` PRs are for reviewers. Group the changes by theme, not by file, and say why each matters.
- Put extra detail in collapsed `<details>` blocks, as bullet points.
- No test plan section: CI covers that.
- After pushing more commits, check that the description still matches.

Don't restate the diff, narrate how you got to the change, or write a section per commit.

<!-- cspell:ignore strate -->
