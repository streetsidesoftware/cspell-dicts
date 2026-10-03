import { basename, dirname, extname, join } from 'node:path';

const hunspellExtensions = ['.dic', '.aff'];

export function isHunspellFile(file: string): boolean {
    return hunspellExtensions.includes(extname(file));
}

/** The .dic and .aff files of a Hunspell source. */
export function hunspellPair(file: string): string[] {
    const ext = extname(file);
    return hunspellExtensions.map((e) => join(dirname(file), basename(file, ext) + e));
}
