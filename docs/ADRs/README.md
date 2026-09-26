# Architecture Decision Records

An Architecture Decision Record (ADR) records one design decision: the situation, the choice, and its consequences.
ADRs are for decisions where a reasonable person could have chosen differently. Ideas that haven't been decided yet
belong in an issue instead.

The templates for every file described here are in [`template.md`](./template.md).

## When to write ADRs

Write ADRs before building a change whose design has more than one reasonable answer, especially when the choice is
hard to undo once it ships:

- a new dictionary package's name and dictionary IDs
- which file types or locales a dictionary is turned on for by default
- splitting, merging, or renaming dictionaries or dictionary IDs
- switching a dictionary to a different upstream source, or a source with a different license
- a change to shared build tooling that changes what dictionaries contain

Skip them for word additions and removals, bug fixes, refactors, dependency updates, and changes whose behavior is
already fully specified.

## Layout

Each feature has its own folder, named by a short kebab-case feature slug, for example `split-software-tools`.

- `docs/ADRs/<feature>/README.md`: the feature's index. It states why the feature exists, who it affects, its goal,
  what's out of scope, and lists its decisions.
- `docs/ADRs/<feature>/NNNN-<decision>.md`: one file per decision. Numbers have four digits and start at `0001` within
  each feature.

Closely related decisions can share one ADR (a dictionary's name and its IDs). Decisions that can change separately get
separate ADRs (a dictionary's IDs, and which file types turn it on).

## Status

- `Proposed`: under discussion.
- `Accepted`: decided.
- `Accepted, amended`: decided, then changed after merge (see [Amending](#amending)).
- `Superseded by NNNN`: overturned by a later ADR in the same feature.

## Designing a feature

### 1. Start with why

Before any decision, write the feature's `README.md`: why it's being done, the stakeholders and how each is affected,
the goal, and what's out of scope. Every decision is weighed against these.

### 2. Decide one thing at a time

- Write an ADR for each decision as it's made, and add its row to the feature's `README.md`.
- Commit each ADR as it's written, so the history shows how far the design got.
- Record questions that were deferred under "Open questions" in the feature's `README.md`.

### 3. Keep the glossaries current

- A term introduced by this feature goes in the [ADR glossary](./glossary.md).
- A concept maintainers need to know across the repo goes in the main [glossary](../glossary.md).
- A term that becomes repo-wide moves from the ADR glossary to the main one.

### 4. Finalize before merge

When the design is final, rewrite the feature's ADRs into the smallest set that states the final design:

- Remove superseded ADRs, and any whose content a later one absorbed.
- Merge ADRs that only refine each other.
- Write each ADR as the current decision, with no revision history. Rejected alternatives stay, briefly, in Context.
- Renumber from `0001`, mark everything `Accepted`, and update the index.

The working history stays in the branch and the PR.

## Amending

After a design has merged, don't rewrite or squash its ADRs.

- To change a decision, add an `## Amendment: <what changed>` section to the ADR, and set its status to
  `Accepted, amended`.
- To reverse a decision, write a new ADR that supersedes it.

## Archiving

This repo doesn't keep an ever-growing history of ADRs. About three months after a feature ships, its ADRs are replaced
by a short summary. Archive a feature when it's due, or earlier when a maintainer asks.

- The [Features](#features) table records when each feature shipped. Fill in the package, version, and date when the
  first release containing it is published.
- Before deleting anything, move what is still in force to its long-term home: a rule to `CONTRIBUTING.md` or the
  relevant doc under `docs/`.
- Rewrite the feature's `README.md` as the archive summary, with a permalink to the full ADRs in git history.
- Delete the individual ADR files, and mark the feature archived in the table below.

## Links

Link to a feature's `README.md`, never to a single ADR file. This applies to code comments, docs, and glossary entries.
The `README.md` survives archiving as the summary, so the links keep working. Only ADRs of the same feature link to
each other's files, and those are deleted together.

## Branches

Work on a design in an `adr/<feature>` branch, and on archiving in an `adr-archive/<feature>` branch.

A new dictionary is the exception: its design and the package ship together, in one `new-dictionary/<name>` branch
and one PR.

## With Claude Code

The `feature-adr` skill runs this process as an interview: it asks one decision at a time, writes and commits the
ADRs, keeps the glossaries current, and offers to archive features that are due.

## Features

| Feature | Description | Shipped | Status |
| ------- | ----------- | ------- | ------ |
