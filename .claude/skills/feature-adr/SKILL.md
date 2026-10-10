---
name: feature-adr
description: 'Designs a cspell-dicts change that has more than one reasonable answer through a structured interview, recording each decision as an ADR under docs/ADRs/<feature>/ and keeping the glossaries current. Covers which file types or locales enable a dictionary, splitting, merging, or renaming dictionaries or dictionary IDs, switching an upstream source, and tooling changes that change what dictionaries contain. Use when the user wants to design, spec out, or plan such a change before building it, is unsure how an edge case should behave, or asks for an ADR, a design doc, or to "figure out the details", even without saying "ADR". Also changes a merged design, or archives a shipped one. For a new dictionary that fits docs/guides/new-dictionary.md, use new-dictionary, which runs this interview itself without ADRs. Not for word changes, bug fixes, refactors, dependency updates, or fully specified changes.'
---

# feature-adr

Settles a design before it's built, by interviewing the user one decision at a time. The goal is a well-designed
feature; ADRs are the tool. Read `docs/ADRs/README.md` and `docs/ADRs/template.md` first: they define the layout,
statuses, finalizing, changing a merged design, archiving, and links.

## Workflow

### 1. Check for features due for archiving

Keep old designs from piling up.

- **Check:** the Features table in `docs/ADRs/README.md`. A feature that shipped three or more months ago and isn't
  archived is due.
- **Stop and ask:** offer to archive it (step 10). Then continue with what the user asked for.

### 2. Name the feature

Agree on the short kebab-case slug that names the folder and the branch, such as `split-software-tools`.

- **Stop and ask** for the slug if the user hasn't given one, and confirm it before creating files.

### 3. Set up a branch and worktree

Keep the design out of the user's checkout, so it never sits as uncommitted changes there.

- **Check** for an earlier session's work first:

  ```sh
  git worktree list
  git branch --list adr/<feature>
  ```

- **Do:**
  - With neither, create both from an up-to-date `origin/main`, in the main checkout: the first path that
    `git worktree list` prints. This is local and reversible, so no need to ask:

    ```sh
    git fetch origin main
    git worktree add -b adr/<feature> .claude/worktrees/adr-<feature> origin/main
    ```

  - With the branch but no worktree, attach it: the same command without `-b`.
  - When the user or the environment named a branch for this work, such as in a cloud session, use it and skip the
    worktree. A session's own unrelated branch doesn't count.
- **Do:** open a draft PR once the first ADR is committed, and tell the user. It makes outside review easier and
  leaves a trail. Push each later commit to it.

### 4. Prepare

Start the feature's files, and learn the terms and facts the options depend on.

- **Do:**
  - Read `docs/glossary.md` and `docs/ADRs/glossary.md`, and reuse their terms.
  - Read `docs/dictionary-packages.md` and `docs/repository.md`, for sources shared between dictionaries and for
    generated files.
  - Add the feature's row to the Features table, with the status `Designing`, and create its `README.md` from
    `docs/ADRs/template.md`.

### 5. Interview, starting with why

Know why the feature exists before deciding anything, then decide one thing at a time.

- **Ask** these first, as open questions, and write the answers in the feature's `README.md`. Commit it, with the
  Features row, before the first ADR:
  - What problem prompted this, and why now? Ask "why?" of each answer until the underlying reason is clear.
  - Who are the stakeholders, and how is each affected?
  - What does success look like, and what's out of scope?
- **Do:** read `references/interview-guide.md` before the first decision. It lists this repo's real decision points;
  skip what doesn't apply.
- **Ask** each decision this way:
  - One question at a time. Move on only when it's resolved.
  - Lettered options, each showing what the user would write or see: the cspell config, or a line of text and whether
    it's flagged. Put your recommendation first, and say why.
  - Check facts before asking, such as with `pnpm exec cspell trace` or a test build, and bring the result.
  - "You decide" is an answer: propose a default, and record it as the decision.
  - The user can defer: record the question under Open questions. Before finalizing, answer it if it could change
    the design's shape; otherwise say what it waits on.
- **Do:**
  - A question with only one reasonable answer, once you look at the code, isn't an ADR. Note it and move on.
  - A remark made in passing is often a standing rule. Confirm it, then record it where it applies: a doc under
    `docs/`, `CONTRIBUTING.md`, or `CLAUDE.md`.

### 6. Write and commit each ADR as it's decided

Keep the design's history in commits, not in the user's memory.

- **Do:**
  - Write the ADR by the README's layout and statuses, and add its row to the feature's `README.md`.
  - Commit both together, one commit per ADR change, such as:

    ```text
    docs: split-software-tools ADR 0002, tools get their own ID
    ```

- **Check** the existing files first, in case this resumes an earlier session.
- **Do:** restructure the ADRs whenever they stop reading as one line from the Why, as the README's "Decide one thing at
  a time" describes. Don't wait for step 9.

### 7. Keep the glossaries current

Add each new term as it comes up.

- **Do:** follow the README's rules. Link each entry to the feature's `README.md`, never to a single ADR. Commit
  glossary edits as they happen.

### 8. Close the loop

Hand the user a clear state once every open question is answered or says what it waits on.

- **Do:** tell the user:
  - what was decided, one line per ADR, pointing at the feature's `README.md`.
  - what was left open.
  - which names are still provisional. Each needs a decision, or an issue saying when it must be decided.
  - where the work lives: the branch, and the worktree's path.
- **Do:** stop at the design. A quick prototype is fine when it answers a question faster. Building is a separate
  step, such as with the `new-dictionary` skill.

### 9. Finalize

Turn the working ADRs into the design as it stands.

- **Stop and ask:** wait until the user says the design is final.
- **Do:** rewrite the ADRs as the README's "Finalize before merge" describes, including the Why, the Goal, and What
  we learned. Update the index, check that each glossary entry from this feature still describes the final design,
  and commit on the same branch.
- **Check:** start a subagent that is given only the paths of the feature's `README.md` and its ADRs. Ask it to say what
  gets built, why, and how the decisions fit together, and to list gaps, contradictions, and anything it had to guess.
- **Stop and ask:** show the user the subagent's report, and fix what they agree with.
- **Stop and ask:** does the design get its own `docs:` PR, or go in the PR that builds it? See the README's
  "Branches".

### 10. Change or archive

Keep a merged design true, or replace a shipped one with a summary.

- **Do,** to change a design: follow the README's "Changing a merged design".
- **Do,** to archive one: work on an `adr-archive/<feature>` branch, as in step 3, and follow the README's
  "Archiving":
  - Note the last commit on `main` with the full ADRs, for the permalink.
  - Search the repo for links into the feature's folder. Fix any that point at a single ADR instead of its
    `README.md`.
  - Move anything still in force to its long-term home before deleting a file.
- **Stop and ask:** open a PR, so the user reviews the summary before the detail leaves the tree.

## Not this skill

- The request is really a word change, or a change that's already fully specified. Say so, and stop.
- ADRs are for people: they never point to `CLAUDE.md`.
