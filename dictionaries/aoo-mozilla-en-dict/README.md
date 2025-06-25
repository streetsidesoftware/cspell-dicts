# Synchronized copy of [aoo-mozilla-en-dict](https://github.com/marcoagpinto/aoo-mozilla-en-dict)

This copy exists to avoid having changes in aoo-mozilla-en-dict break building dictionaries.

It can happen that a dictionary source "goes away" preventing us from building the dictionary.

This "package" exits as a centralized point for aoo-mozilla-en-dict dictionary dependencies.

We also try to avoid including binary files.

> [!WARNING]
>
> - The words in this folder are not indented to be maintained manually via PR.
> - PRs about adding or fixing words would be rejected.
> - If you want to contribute to this source, please consider opening an issue on original source.
> - If you want to update aoo-mozilla-en-dict from its source, PRs are welcomed

## Licenses

As stated on the [aoo-mozilla-en-dict](https://github.com/marcoagpinto/aoo-mozilla-en-dict?tab=readme-ov-file#licences-for-the-dictionaries) repository,
licenses vary between each dictionary:

- en_AU (Kevin Atkinson) — BSD/MIT-Like
- en_CA (Kevin Atkinson) — BSD/MIT-Like
- en_GB (Marco A.G.Pinto) — LGPL
- en_US (Kevin Atkinson) — BSD/MIT-Like
- en_ZA (Marco A.G.Pinto) — LGPL

You can find more information about this in the README files provided in each subfolder.

CSpell code and additional words are provided with MIT license, but because its package code that comes
from external sources that have different license, it implies that some dictionary are packaged with LGPL license

For example, any CSpell dictionary that includes aoo-mozilla-en-dict en_GB or en_ZA files licensed under LGPL are licensed with LGPL.
