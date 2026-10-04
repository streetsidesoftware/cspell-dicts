---
name: release-notes
description: 'Corrects a merged PR''s Release Please changelog entry when its Conventional Commit type, scope, or message was wrong, by adding a BEGIN_COMMIT_OVERRIDE block to the merged PR''s description, which Release Please reads on its next run. Also audits the open release PR ("chore: release main") for entries that do not belong. Use when the user asks to fix, override, correct, or reclassify a PR''s release notes, changelog entry, or commit message after merge, or mentions BEGIN_COMMIT_OVERRIDE, even without the words "release notes": "that PR should not have been a fix", "the changelog has internal stuff in it", "can we reclassify #5706". Does not rewrite git history. For choosing the type of a PR that has not merged, see docs/commits-and-pull-requests.md.'
---

# release-notes

Corrects a changelog entry after its PR has merged, by editing the merged PR's description, never git history. Read
`docs/commits-and-pull-requests.md` first: it defines each type and which ones the changelog shows.

The reader of the release notes is a cspell user asking one thing: does this change what gets flagged in my files? Judge
every entry by that.

## Workflow

### 1. Choose the scope

Know whether this is one PR or an audit of the release PR.

- **Do:**
  - The user names a PR, such as "fix #5706's release note": go to step 3.
  - The user points at the open release PR, titled `chore: release main`: do step 2 first.

### 2. Audit the release PR

Find the entries that don't belong, and agree on them with the user.

- **Do:**
  - Read the rules: `docs/commits-and-pull-requests.md`, and the `changelog-sections` in `release-please-config.json`
    (generated from `scripts/gen-release-please-config.mts`).
  - Fetch the release PR's description. It lists each dictionary being released, with its entries by section, each
    linking to its source PR.
- **Check** each entry:
  - Its type matches the doc, including `!`. A shown type that a cspell user wouldn't notice belongs under a hidden
    type. Reclassifying it removes it from the release notes.
  - It's listed under a dictionary it belongs to. An entry lands in every dictionary whose files the PR changed. An
    override can't fix that: tell the user.
  - Leave alone:
    - entries that only say "workspace dependencies were updated": a dependency was released.
    - the bot PRs "Update Dictionaries" and "Build Dictionaries", which are `fix:` on purpose.
- **Stop and ask:** show the flagged entries with your reasoning and their PR numbers, and let the user choose which to
  correct.

### 3. Decide the corrected message

Write the `type(scope): description` each PR should have had.

- **Do:**
  - The type and scope, as in `docs/commits-and-pull-requests.md`. The scope is the dictionary's directory under
    `dictionaries/`, such as `fix(en_US): …`. Leave it out when the PR spans dictionaries.
  - `type!:` for a breaking change.
  - For a shown type, describe it for a cspell user: which words or behavior changed.
  - Keep the original wording unless it was unclear too.

### 4. Confirm the PR was squash-merged

An override only works on a squash-merged PR.

- **Check:**
  - The PR's merge commit on `main` has a single parent, and the PR's title as its subject.
  - If the repository settings are available: only squash merging is allowed.
- **If it fails:** stop, and tell the user the override won't take effect.

### 5. Edit the PR description

Add the override to the merged PR, and nowhere else.

- **Do:**
  - Fetch the description: `gh pr view <N> --json body`.
  - With no `BEGIN_COMMIT_OVERRIDE` block, add one at the end, after a blank line. A PR that held two changes gets one
    message per paragraph inside the block:

    ```text
    BEGIN_COMMIT_OVERRIDE
    chore: add Claude Code skills
    END_COMMIT_OVERRIDE
    ```

  - With an existing block, replace its contents. Never add a second block.
  - Leave the rest of the description untouched.
  - Never edit the release PR's description: Release Please regenerates it on every run.
- **Stop and ask:** show the new description, or a diff of it, before applying it with
  `gh pr edit <N> --body-file <file>`. Anyone reading the PR later sees the edit.

### 6. Trigger Release Please

Show the user the result.

- **Do:** tell the user the override takes effect on Release Please's next run, not in the open release PR until then.
- **Stop and ask:** offer to run it now. It updates a PR other people may be watching.

  ```sh
  gh workflow run release-please.yml
  ```

- **Do:** after it runs, point the user at the run and the updated release PR.
