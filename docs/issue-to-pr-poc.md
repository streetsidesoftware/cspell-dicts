# Issue → PR automation (proof-of-concept)

> Status: proof-of-concept for maintainer discussion, **not** production-hardened.

This lets a contributor submit one or more new words for an existing dictionary
through a GitHub Issue Form, instead of forking the repo, editing a source
file, running the build, and opening a PR by hand. A workflow parses the
issue, edits the dictionary's source file, rebuilds it, and opens a pull
request.

```text
Issue Created
  ↓  (.github/ISSUE_TEMPLATE/add-dictionary-words.yml)
Workflow Runs
  ↓  (.github/workflows/issue-to-pr.yml + scripts/issue-to-pr/*.mjs)
Dictionary Updated
  ↓  (dictionaries/<name>/src/*.txt, then `pnpm run lint:fix:sort-source-files`
  ↓   + `pnpm run prepare:dictionaries`)
PR Created
     (peter-evans/create-pull-request, branch `issue-<number>`)
```

Run `node scripts/issue-to-pr/demo.mjs` to see all four steps run locally
against a throwaway fixture (no GitHub, no real files touched).

## Files added

| File                                              | Purpose                                                                                                |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `.github/ISSUE_TEMPLATE/add-dictionary-words.yml` | The issue form (`file` input, `words` textarea, optional `notes` textarea).                            |
| `.github/workflows/issue-to-pr.yml`               | Orchestrates the steps below on `issues: opened`.                                                      |
| `scripts/issue-to-pr/lib.mjs`                     | Shared `fail()` / `writeOutput()` helpers (Action-output + error plumbing).                            |
| `scripts/issue-to-pr/parse-issue.mjs`             | Phase 4: parse the issue body, validate the target file path + words.                                  |
| `scripts/issue-to-pr/insert-words.mjs`            | Phase 6: insert words above the trailing marker comment (or append).                                   |
| `scripts/issue-to-pr/format-pr-body.mjs`          | Phase 8: build the branch name / title / body for the PR (mirrors `.github/pull_request_template.md`). |
| `scripts/issue-to-pr/demo.mjs`                    | Offline demo of phases 4, 6 and 8 end to end.                                                          |

## Phase 1 findings: what already existed

- `.github/actions/setup` runs `pnpm i && pnpm run setup`, and `setup` in
  `package.json` is `pnpm i && pnpm prepare:dictionaries`. So **`pnpm run
setup` is the right command** (matching the hint given for this task) -
  there's no need to call `prepare:dictionaries` directly, and it's already
  wired into the existing composite action.
- `.github/actions/pr` ("`create_pr`") wraps a _private_ reusable action,
  `streetsidesoftware/actions/.github/actions/pr@v1`, authenticating with a
  GitHub App (`secrets.AUTOMATION_APP_ID` / `AUTOMATION_PRIVATE_KEY`). It's
  used by `build-dictionaries.yml`, `update-dictionaries.yml`,
  `update-dependencies.yml`, `update-dependabot.yml`. Its source isn't in
  this repo, so its full interface can't be verified from here - see
  [Why not reuse `./.github/actions/pr`](#why-not-reuse-githubactionspr) below.
- `build-dictionaries.yml` is the closest existing analog: checkout → setup
  → `pnpm run lint:fix:sort-source-files` → `pnpm run setup` again → build →
  PR. This workflow follows the same shape.
- `scripts/sort-source.mjs` / `scripts/lib/sortContent.mjs` already sort
  source files while keeping comment lines as fixed group boundaries, so we
  don't need to sort words ourselves - we just insert them anywhere before
  the trailing marker comment and let `pnpm run lint:fix:sort-source-files`
  re-sort the surrounding block into place.
- No prior issue→PR or issue-parsing automation existed (`grep -R` for
  `create_pr`, `uses: ./.github/actions/pr` only turned up the workflows
  above; nothing reacts to the `issues` event today).

## Key design decisions

### Letting the issue creator pick the exact file

The task's example (`dictionaries/git/src/git.txt`) doesn't match the actual
repo layout - `git` has **two** files (`terms.txt`, `additional_words.txt`),
neither containing the "Please add new terms above this line" marker. A
repo-wide check found ~80 of ~115 dictionaries have exactly **one**
`src/*.txt` file, but the rest (`git`, `python`, `typescript`, `node`, `npm`,
`html`, `rust`, `software-terms`, ...) have 2-22, and a handful (e.g. `en_US`,
`sv`, `bn`) also have nested subdirectories under `src/` containing vendored
third-party dictionary sources (hunspell `.dic`/`.aff`, OpenOffice, synced
GitHub word lists) that contributors shouldn't hand-edit at all.

An earlier version of this PoC tried to resolve this automatically (use the
one file with the trailing marker comment, fail closed otherwise), but that
only worked for dictionaries that happened to have the marker - it still
failed for `git` itself. Guessing further (e.g. "pick the file with the
shortest name" or "the one matching the dictionary's name") would only ever
be a heuristic with edge cases, for something a human glancing at the
`dictionaries/` folder on GitHub can already tell at sight.

So instead, the issue form's `File` field asks for the exact path up front
(e.g. `git/src/terms.txt`), and `parse-issue.mjs` just validates that it
matches `<dictionary>/src/<file>.txt` and exists - no guessing, no
ambiguity, and it works uniformly for single- and multi-file dictionaries.
The trade-off is it asks slightly more of the issue creator (browse the repo
to find the right file) instead of just naming the dictionary.

### Matching the existing PR template

GitHub does **not** auto-insert `.github/pull_request_template.md` when a PR
is opened with an explicit body via the API (only the web UI does that, and
only for an empty body) - so `peter-evans/create-pull-request` would
otherwise produce a body in whatever ad hoc shape we wrote. `format-pr-body.mjs`
instead reproduces the template's structure (`Dictionary:` line,
`Description`, `References`, `Checklist`) so an automated PR looks the same
as one a human would open per `CONTRIBUTING.md`. The References section
includes `Fixes #<issue>`, so merging the PR automatically closes the
issue that requested the word(s) - this only fires on merge, not on PR
creation, so a rejected/closed-without-merging PR correctly leaves the
issue open. The "title starts with the correct prefix" checkbox is
pre-checked, since the title is always
generated as `fix: add words to <dictionary> dictionary`; the Code of
Conduct checkbox is left for a human to confirm.

### Why not reuse `./.github/actions/pr`?

It's the established way other workflows in this repo open PRs, but its
actual implementation lives in the private `streetsidesoftware/actions`
repo, so it can't be verified or extended from here, and it requires a
GitHub App (`secrets.AUTOMATION_APP_ID` / `AUTOMATION_PRIVATE_KEY`) that
isn't configured for this PoC. Rather than guess at its interface, this PoC
uses the well-known
[`peter-evans/create-pull-request`](https://github.com/peter-evans/create-pull-request)
action (pinned by commit SHA), authenticated with the default
`secrets.GITHUB_TOKEN` (scoped down to `contents: write`,
`pull-requests: write`, `issues: write` for just this workflow).

**Known limitation:** PRs opened with the built-in `GITHUB_TOKEN` don't
trigger other `pull_request`-triggered workflows (e.g. CI) - this is a
GitHub Actions restriction to prevent infinite workflow loops, and is
likely why the repo's own automation uses a GitHub App instead. **Suggested
follow-up for a production version:** switch to `./.github/actions/pr` so
generated PRs get CI runs like any other PR.

### Gating on the issue form

Issue events fire for _every_ issue, not just ones from this form, and
there's no template ID in the event payload. Issue-form `labels:` must
already exist in the repo to be applied, so relying on a label would
silently no-op until a maintainer pre-creates `dictionary-words`. Instead the
job-level `if:` checks the rendered body for `### File` and `### Words`
headings, which only this form produces. The form still sets the
`dictionary-words` label for human triage in the issue list.

### Treating the issue body as untrusted input

`github.event.issue.body` (and anything derived from it - the file path, the
word list, error messages that echo a rejected word back) is never spliced
directly into a `run:` shell block or an `actions/github-script` `script:`
block via `${{ }}` - that's the standard GitHub Actions script injection
vector. Instead it only ever flows in through `env:` and is read with
`process.env` inside Node, including in the three "comment on the issue"
steps. `parse-issue.mjs` also restricts the file path to
`<dictionary>/src/<file>.txt` (`[a-zA-Z0-9_-]+/src/[a-zA-Z0-9_.-]+\.txt`) and
resolves it under `dictionaries/` with a `path.resolve` containment check
before touching the filesystem, so the file path is the only
repository-path input, as required.

The optional "Additional Notes" field (free text - why a word should be
added, a source/reference for it) is never used for a file path or shell
command, so it only needs one extra guard: it's rendered into the PR body
inside a fenced code block sized so the content can't prematurely close it
(`codeFence()` in `format-pr-body.mjs`), so it can't be used to inject
markdown structure or a `Fixes #<other-issue>` that would close an unrelated
issue when the PR merges. `demo.mjs`'s fixture notes deliberately include
`Fixes #999` to demonstrate this stays inert text.

### No-op and failure feedback

- If every submitted word already exists in the file, no PR is opened and
  the bot comments explaining why (avoids empty/no-diff PRs).
- If parsing or insertion fails for any reason, the bot comments the
  specific reason (not just "workflow failed") so the contributor knows
  whether to fix the file path, pick a different file, or just open a
  manual PR.

### Anyone can trigger this

Unlike the repo's other automation (gated on `github.repository_owner` or
internal credentials), this responds to issues opened by anyone, by design -
the goal is to lower friction for outside contributors. The blast radius is
limited (a maintainer still has to review and merge, strict word/file-path
validation, no write access to anything outside one `src/*.txt` file, no
auto-merge), but it is still public-input-triggered CI spend with no rate
limiting, and PRs are opened immediately rather than held for review first.
Worth a maintainer discussion before enabling for real.

## Local demo

```sh
node scripts/issue-to-pr/demo.mjs
```

Runs phases 4, 6 and 8 against a temp-directory `git` dictionary fixture with
**two** source files (`terms.txt`, `additional_words.txt`, mirroring the real
repo), submitting File: `git/src/terms.txt` and Words:
`push`/`pull`/`github`/`fetch` - the explicit file path shows the new
multi-file dictionaries work with no disambiguation step, and the repeated
`fetch` (already in `terms.txt`) demonstrates the "already present, skipped"
path alongside genuinely new words. Prints each phase's output, including
the final simulated PR title/body. It never touches files under the real
`dictionaries/` directory and makes no GitHub API calls.

To see the real workflow run end-to-end, push this branch to a repo where
Actions are enabled and open an issue using the "Add Words to a Dictionary"
template - that step wasn't performed as part of this PoC since it would
create real issues/PRs/Action runs.

## Out of scope for this proof-of-concept

- Abuse mitigation (rate limiting, first-time-contributor checks, CAPTCHA).
- Re-using the GitHub App identity (`./.github/actions/pr`) so generated
  PRs trigger CI like normal PRs.
- Editing the issue (`types: [edited]`) to amend an already-opened PR.
- Internationalization/locale-specific word validation beyond the generic
  character-class checks in `parse-issue.mjs`.
