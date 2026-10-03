# generator-cspell-dicts

Generate cspell dictionary sub-projects.

## Usage

Run it in the [cspell-dicts](https://github.com/streetsidesoftware/cspell-dicts) repository:

```bash
pnpm install
pnpm run create-dictionary
```

It asks a few questions and creates the package in `dictionaries/<name>/`. Each answer can also be given as an option,
and `--yes` runs it without questions. Run `pnpm run create-dictionary --help` to list the options. See
[Creating a dictionary](https://github.com/streetsidesoftware/cspell-dicts/blob/main/docs/guides/new-dictionary.md).

## License

MIT © Jason Dent
