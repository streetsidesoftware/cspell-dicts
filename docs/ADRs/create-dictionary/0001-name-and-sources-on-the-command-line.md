# 0001. How the name and the sources are given on the command line

Status: Accepted

## Context

`create-dictionary` takes the directory name and one source file, each either positionally
(`pnpm create-dictionary ruby words.txt`) or as an option (`--name ruby --source words.txt`). Giving both forms with
different values is an error.

Most dictionaries are compiled from several source files, but the command accepts only one, so the rest are added by
hand afterwards. A Hunspell source is a pair of files, `.dic` and `.aff`, and people often list both even though either
one finds the pair.

Options weighed:

- Keep only one form for each. The positional form is what people and the docs use; the option form reads more
  clearly in scripts. Dropping either breaks one of those habits.
- Several sources as a comma-separated list (`--source a.txt,b.txt`). Short, but it breaks on file names with commas,
  and no other option works that way.

## Decision

We will keep both forms for the name and for the sources.

- The name takes one value. Giving it both ways with different values stays an error.
- Sources take several values: `pnpm create-dictionary ruby ruby.txt gems.txt`, or `--source` repeated. Sources given
  both ways are combined.
- A Hunspell `.dic` and `.aff` with the same name count as one source, whichever of the two is given, or both.

## Consequences

- Every source of a dictionary can be given when it's created, so none is added by hand afterwards.
- The "given twice" error for the source goes away.
- Commands stay short for people (`pnpm create-dictionary ruby words.txt`), and agents can name every value.
