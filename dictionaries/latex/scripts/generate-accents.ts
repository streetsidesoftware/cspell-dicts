import fs from 'node:fs/promises';

import type { CSpellUserSettings, SubstitutionDefinition } from '@cspell/cspell-types';

const cspellJsonFile = new URL('../cspell-ext.json', import.meta.url);

const regExpNonAccent = /\P{M}/gu;

const LATEX_ACCENTS = {
    '`': getAccent('à'),
    "'": getAccent('á'),
    '^': getAccent('â'),
    '"': getAccent('ä'),
    '~': getAccent('ã'),
    '=': getAccent('ā'),
    '.': getAccent('ȧ'),
    u: getAccent('ă'),
    v: getAccent('ǎ'),
    H: getAccent('ő'),
    t: getAccent('a͡'),
    c: getAccent('ş'),
    d: getAccent('ạ'),
    b: getAccent('ο̩'),
    k: getAccent('ą'),
};

function getAccent(char: string): string {
    return char.normalize('NFD').replaceAll(new RegExp(regExpNonAccent), '');
}

function generateAccentSubstitutions(): Map<string, string> {
    const substitutions: Map<string, string> = new Map();

    const letters = 'aceinosuy';

    for (const [escape, accent] of Object.entries(LATEX_ACCENTS)) {
        for (const letter of letters) {
            const accented = (letter + accent).normalize('NFC');
            // console.log(`Adding substitution for "${accent}" \\${escape}${letter} -> ${accented}`);
            if (accented.length === 1 && accented !== letter) {
                substitutions.set(`\\${escape}${letter}`, accented);
            }
        }
    }

    return substitutions;
}

async function main() {
    const cspellJson = JSON.parse(await fs.readFile(cspellJsonFile, 'utf-8')) as CSpellUserSettings;

    const substitutions = generateAccentSubstitutions();
    const substitutionDefinitions: Map<string, SubstitutionDefinition> = new Map(
        (cspellJson.substitutionDefinitions || []).map((def) => [def.name, def]),
    );
    const latexSubstitution: SubstitutionDefinition = substitutionDefinitions.get('latex-accents') || {
        name: 'latex-accents',
        entries: [],
    };
    substitutionDefinitions.set(latexSubstitution.name, latexSubstitution);
    const entries = new Map([...latexSubstitution.entries, ...substitutions.entries()]);
    const sortedEntries = [...entries.entries()].sort(([a], [b]) => a.localeCompare(b));
    latexSubstitution.entries = sortedEntries;
    cspellJson.substitutionDefinitions = [...substitutionDefinitions.values()];

    await fs.writeFile(cspellJsonFile, JSON.stringify(cspellJson, null, 4) + '\n', 'utf-8');
}

main();
