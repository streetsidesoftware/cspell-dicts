# Design principles

<!--
audience: developer, maintainer
kind: reference
level: knows the repo's dictionaries and conventions
-->

> [!NOTE]
> For maintainers and developers weighing a design.

Rules that hold across dictionaries. Weigh every [design](./feature-design.md) against them. When a design sets a new
rule that holds beyond its feature, add it here.

## A dictionary doesn't depend on its upstream

An upstream source can be moved, removed, or changed in a way we can't use. That must never break a dictionary.

- Every source has a local copy, so the dictionary builds without downloading anything.
- A sync only updates that copy.

See [Sources](./dictionary-packages.md#sources).

## Every source can be traced

A built dictionary is often a derivative work of its sources, so their licenses apply to it.

- Where each source came from and its license are written down.
- Its license is published with the dictionary.
- A license that's missing, unclear, or would change the dictionary's license stops the work until a maintainer decides.

See [Check the sources and their license](./guides/new-dictionary.md#3-check-the-sources-and-their-license).

## Names are public from the first release

Users write a dictionary's IDs in their configs as soon as it ships. Renaming one breaks those configs, so settle the
name first.

## A dictionary is enabled only where its words are right

Enabling a dictionary accepts its words, including where they should be flagged. A dictionary is never enabled for
every file by accident: an always-enabled one is a decision a maintainer makes.

See [Decide the design](./guides/new-dictionary.md#2-decide-the-design).
