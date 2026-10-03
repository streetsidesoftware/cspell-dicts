# 0019. Remote sources come from npm or GitHub; download pages are local sources

Status: Accepted

## Context

About 30 Hunspell dictionaries have no `sync` script. Where their READMEs point:

- GitHub or GitLab, so they could be synced: for example `az_AZ`, `fi_FI`, `sk_SK`, `tr_TR`, and `gl_ES` on GitLab.
- A website or download page: `be_BY`, `fr_FR` (grammalecte.net), `he` (hspell), `hy`, `pt_PT`, `en_US`
  (wordlist.sourceforge.net).
- Other hosts: `ca` (freedesktop cgit), `lt_LT` (Launchpad), `sl_SI` (openoffice.org), and `nb_NO`, whose host
  (alioth.debian.org) has been shut down.
- No usable origin: `bg_BG`, `eo`, `la`, and `vi_VN`.

Download pages are real, but mostly among older dictionaries; most living upstreams are on GitHub. Options weighed: a
`--define-source-url` that downloads, unpacks, and syncs an archive (each site's archive differs: zip, oxt, tar), or a
GitLab kind like GitHub's.

## Decision

We will support two kinds of remote source, GitHub (`--define-source-github`) and npm (`--define-source-npm`), preferring
the source repository ([0022](./0022-prefer-the-source-repository-npm-from-a-cdn.md)). A source
from a download page or any other host is downloaded by hand and defined as a local source with `--define-source`, with
`--add-source-url` recording where it came from.

## Consequences

- Every source can be traced to its origin, even when it can't be synced.
- A source from a download page or another host is updated by hand.
- A download or GitLab kind can be added later if new dictionaries need it.

<!-- cspell:ignore grammalecte hspell cgit -->
