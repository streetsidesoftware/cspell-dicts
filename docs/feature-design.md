# Designing a feature

<!--
audience: developer, maintainer
kind: guide
level: knows the repo's dictionaries and conventions; comfortable with git and PRs
-->

> [!NOTE]
> For maintainers and developers thinking a change through before they build it.

A design helps you think a change through before and while you build it. It holds decisions and their reasons: why the
change is needed, who it affects, what was chosen, and what was turned down. It's for whoever builds the change, for
the people who review it, and for anyone who later wonders why it's shaped the way it is.

A design doesn't describe how the code behaves. The code, tests, and docs are the source of truth, and most readers
assume a design is out of date. It isn't a contract either: when building or using a feature shows a better answer,
change the design.

## When to write one

It's never required. Write one when you want to think before building, or when a reviewer suggests it. It's worth it
when a change has more than one reasonable answer, especially when the choice is hard to undo once it ships:

- a new dictionary that takes a different approach from the [new-dictionary guide](./guides/new-dictionary.md), or
  needs scripts of its own beyond `pnpm create-dictionary`, the build, and a standard `sync` script
- changing which file types or locales an existing dictionary is enabled for by default
- splitting, merging, or renaming dictionaries or dictionary IDs
- switching a dictionary to a different upstream source, or a source with a different license
- a change to shared build tooling that changes what dictionaries contain

Skip it for new dictionaries built the normal way, word additions and removals, bug fixes, refactors, dependency
updates, and changes whose behavior is already fully specified. An idea nobody has decided to pursue yet belongs in an
issue.

## Where it lives

Start with one file, `docs/designs/<feature>.md`, named by a short kebab-case slug, such as `split-software-tools`. Add
a line for it to the list in [`docs/designs/README.md`](./designs/README.md) in the same PR.

Not every design fits in one file. When a part can be read on its own, move the design to a folder:

- `docs/designs/<feature>/README.md` keeps the why, the sketch, links to the other files, and the open questions.
- Each other file covers one topic, named by a slug, such as `merging.md`.

Edit the files in place as the design changes. Git history keeps the earlier versions, so the files don't have to.

Open the PR as soon as you want feedback. A small feature can ship its design and code together in one PR, and the code
decides the PR's type. When a design is worth reviewing before it's built, merge it on its own with a `docs:` PR, so it
stays out of the release notes. See [Commits and pull requests](./commits-and-pull-requests.md).

## The file

```markdown
# <Feature>

## Why

<The problem, who has it, and what they can't do today. A few lines.>

## Design

<The sketch: the shape of the solution in a few lines, with one example of what a user writes (the cspell config or
the command line) and what comes of it. Then each choice that could change the sketch or is hard to undo, with the
alternatives turned down and why.>

## Open questions

- <A side question or deferred point, in one line.>
```

- Add anything else the reader needs to understand the why, such as who it affects, under Why.
- Record what's out of scope only when a reader would otherwise assume the feature covers it.
- Keep a name only when it's user-visible and part of the decision, such as a dictionary ID, a command-line option, or
  a file a dictionary contains. Internal names tie the design to the code.
- Define a new term where it's first used. If it's used across the repo, add it to the
  [glossary](./glossary.md) in the same PR.
- Give the new doc an [audience header](./style.md#audience).

## How to design

Work from the top down, and stop when the code is the easier way to answer the rest.

### 1. Get to the why

A change usually starts as a problem to solve, or as a solution ("we need a new dictionary"). Ask "why?" until you
reach the reason: who is affected, and what goes wrong for them today. Look at the issue and the code first, so the why
rests on facts. Then ask why now, what success looks like, and what's out of scope.

### 2. Sketch the design

Write the shape of the solution in a few lines, with one example: what a user writes in their cspell config, and what
cspell reports, or what a contributor types, and what the tool does.

### 3. Work through the questions

Go through the [design questions](./design-questions.md), which include the
[design principles](./design-principles.md). Spend time on a question when its answer could change the sketch, or
would be hard to undo once it ships. Settle anything else with a sensible default. When a detail shows the sketch is
wrong, change the sketch.

### 4. Note side questions

Write each in a line under Open questions, and set it aside. The code usually settles them.

### 5. Let the code settle the rest

When a question is easier to answer by building or trying something, stop designing and build. Update the design when
the code shows a decision was wrong.

## Before merge

Finish the design in the same PR. This removes the working notes, not the reasons.

- Add a `tl;dr` at the top: the choices that matter, in short, plain sentences.
- Add a line saying that the code and docs are the source of truth.
- Keep each decision with the alternatives turned down and why.
- Cut what only restates the code, such as function names and internal steps.
- Settle or drop each open question, and remove the section. Open an issue only for a real problem someone would act
  on.
- List what isn't built yet, if the design merges first.
- In a folder, the `tl;dr` and that line go in the `README.md`. Finish each other file the same way, and delete one that
  no longer adds anything.
- Have someone new to the feature read only the design, without the code. They should be able to say what was decided,
  why, and how the decisions fit together.

If the design set a rule that holds beyond this feature, add it to the [design principles](./design-principles.md) or
the doc under `docs/` where it applies.

## Changing a merged design

Update a design only when the design changes: a decision, or the reason for it. Don't update it because the code
changed, except to take a finished item off its list of what isn't built yet.

- Rewrite the decision in place, and move the old choice to the alternatives turned down, with what showed it was wrong.
- Delete a part that no longer applies. Git history keeps it.

## With Claude Code

The `feature-design` skill runs this as an interview. It can also check a small change for side effects before it's
built.
