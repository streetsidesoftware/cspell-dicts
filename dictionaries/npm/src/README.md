# Source Directory

All source files used to generate the dictionary should be stored in this directory.

## Adding npm packages

- Add the full published package name to `npm.txt`, including the scope for scoped packages. For example, use
  `@ngx-formly/core` for [Formly](https://www.npmjs.com/package/@ngx-formly/core).
- Check that the exact name exists on npm. The update script looks up each entry in the registry and removes entries
  it cannot find. A fragment can also name an unrelated package.
- Run `pnpm run sort` from the repo root, then `pnpm run build` and `pnpm test` in `dictionaries/npm`.
- Check the generated dictionary and add a sample in `samples/list.txt` using the package name. The build splits
  package names according to `cspell-tools.config.yaml`; it does not necessarily accept every component separately.
  For example, `@ngx-formly/core` generates `ngx-formly`, which does not accept standalone `formly`.

The other source files hold npm keywords, tool terms, module imports, and people's names, as their headers describe.
Keep package names in `npm.txt` so the updater can validate them.

<!-- cspell:ignore formly -->
