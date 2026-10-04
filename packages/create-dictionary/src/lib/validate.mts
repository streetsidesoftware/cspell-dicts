import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { toPackageName } from './names.mts';
import type { Repo, TakenNames } from './repo.mts';
import { hunspellPair, isHunspellFile } from './source.mts';

/** A message saying what's wrong, or `true`. */
export type Validate = (value: string) => string | true;

const maxNameLength = 50;
const windowsReservedNames = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i;

export function nameValidator(repo: Repo, taken: TakenNames): Validate {
    return (name) => {
        if (!name) return 'missing. Give the directory name for the dictionary, such as en_AU or ruby.';
        if (!/^[\w-]+$/.test(name)) return `"${name}" can only have letters, digits, "_", and "-".`;
        if (name.length > maxNameLength) return `"${name}" is longer than ${maxNameLength} characters.`;
        if (windowsReservedNames.test(name)) return `"${name}" is reserved on Windows. Choose another name.`;
        if (existsSync(join(repo.dictionariesDir, name))) {
            return `dictionaries/${name} already exists. Choose another name.`;
        }
        const packageName = toPackageName(name);
        const fullPackageName = '@cspell/dict-' + packageName;
        const pkgOwner = taken.packages.get(fullPackageName);
        if (pkgOwner) return `the package name ${fullPackageName} is already used by ${pkgOwner}. Choose another name.`;
        const idOwner = taken.dictionaryIds.get(packageName);
        if (idOwner) return `the dictionary ID ${packageName} is already used by ${idOwner}. Choose another name.`;
        return true;
    };
}

export function validateLanguageId(anyLocale: boolean): Validate {
    return (value) => {
        if (!value.trim()) return 'missing. Give a file type, such as ruby.';
        if (anyLocale && value.trim() === '*') {
            return '"*" with a locale of "*" turns the dictionary on for every file. Set the locale for a natural language, or the file type for anything else.';
        }
        return true;
    };
}

export function validateDescription(value: string): string | true {
    if (!value.trim()) {
        return 'missing. Describe the words it covers, such as "Ruby keywords and standard library names".';
    }
    return true;
}

/** One npm keyword. */
export function validateKeyword(value: string): string | true {
    if (!value.trim()) return 'empty. Give a word people search for, such as golang.';
    if (value.includes(',')) return `"${value}" has a comma. Give one keyword per --keyword.`;
    return true;
}

/** A contributor in npm's one-line form: a name, then an optional `<email>` and an optional `(url)`. */
export function validateContributor(value: string): string | true {
    if (!/^[^<>()]*[^\s<>()][^<>()]*(<[^<>\s]+>\s*)?(\([^()\s]+\))?$/.test(value.trim())) {
        return `"${value}" isn't "Name", "Name <email>", or "Name (url)".`;
    }
    return true;
}

/** Checks a source path, relative to `cwd`. A missing word list is checked separately. */
export function sourceValidator(cwd: string): Validate {
    return (srcFile) => {
        if (!srcFile.trim()) return 'Give the path to a word list or Hunspell .dic file.';
        if (!isHunspellFile(srcFile)) return true;
        const notFound = hunspellPair(srcFile).filter((file) => !existsSync(resolve(cwd, file)));
        if (!notFound.length) return true;
        return `A Hunspell source needs both its .dic and .aff files. Not found: ${notFound.join(' and ')}`;
    };
}
