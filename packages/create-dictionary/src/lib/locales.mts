const languageNames = new Intl.DisplayNames(['en'], { type: 'language', fallback: 'none' });

/** The locale of this machine's setup, such as `de-DE`, so people can type names in their own language. */
const ownLocale = Intl.DateTimeFormat().resolvedOptions().locale;

/** A locale and its name in English, such as `en-AU`, "Australian English", and in this machine's language. */
export interface LocaleName {
    locale: string;
    name: string;
    ownName?: string;
}

/** The name of a locale, such as "Australian English" for `en-AU` or `en_AU`, or undefined if it isn't known. */
export function localeName(locale: string): string | undefined {
    try {
        return languageNames.of(locale.trim().replaceAll('_', '-'));
    } catch {
        return undefined;
    }
}

let known: LocaleName[] | undefined;

/**
 * Every two-letter language, and each regional variant with a name of its own, such as `en-AU`, "Australian English".
 * Built from the names Node knows, so there's no list to keep.
 */
export function knownLocales(own = ownLocale): LocaleName[] {
    if (known && own === ownLocale) return known;
    const ownNames = new Intl.DisplayNames([own], { type: 'language', fallback: 'none' });
    const regionNames = new Intl.DisplayNames(['en'], { type: 'region', fallback: 'none' });
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    const pairs = [...letters].flatMap((a) => [...letters].map((b) => a + b));
    const regions = pairs.map((pair) => pair.toUpperCase()).filter((region) => regionNames.of(region));
    const list: LocaleName[] = [];
    const add = (locale: string, name: string) => {
        const ownName = ownNames.of(locale);
        list.push(ownName && ownName !== name ? { locale, name, ownName } : { locale, name });
    };
    for (const language of pairs) {
        const name = languageNames.of(language);
        if (!name || Intl.getCanonicalLocales(language)[0] !== language) continue;
        add(language, name);
        for (const region of regions) {
            const locale = `${language}-${region}`;
            const regional = languageNames.of(locale);
            // "English (India)" is the language in a region; "Australian English" is a variant with its own name.
            if (regional && !regional.includes('(') && Intl.getCanonicalLocales(locale)[0] === locale) {
                add(locale, regional);
            }
        }
    }
    if (own === ownLocale) known = list;
    return list;
}

/**
 * The known locales whose name, in English or in this machine's language, contains every word of `text`, such as
 * "english", "australian english", or "Englisch".
 */
export function findLocales(text: string, own = ownLocale): LocaleName[] {
    const words = text
        .toLowerCase()
        .split(/\s+/)
        .filter((word) => word);
    if (!words.length) return [];
    const matches = (name: string | undefined) => !!name && words.every((word) => name.toLowerCase().includes(word));
    return knownLocales(own).filter(({ name, ownName }) => matches(name) || matches(ownName));
}

/** A warning for each item of a locale list that isn't a known locale, with the locales its name could mean. */
export function localeWarnings(locales: string): string[] {
    return locales
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item !== '*' && !localeName(item))
        .map((item) => {
            const matches = findLocales(item).slice(0, 8);
            const options = matches.map(({ locale, name }) => `${locale} (${name})`).join(', ');
            return `locale: "${item}" isn't a known locale.` + (options ? ` Did you mean ${options}?` : '');
        });
}
