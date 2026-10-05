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
 * Every two-letter language, in its main region, such as `de-DE`, and each regional variant with a name of its own, such
 * as `en-AU`, "Australian English".
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
        // Its main region, such as de-DE, "German (Germany)".
        const main = new Intl.Locale(language).maximize().region;
        for (const region of regions) {
            const locale = `${language}-${region}`;
            const regional = languageNames.of(locale);
            // Besides the main region, only variants with a name of their own, such as "Australian English", not
            // the language in every region, such as "English (India)".
            const ownName = !!regional && !regional.includes('(');
            if (regional && (region === main || ownName) && Intl.getCanonicalLocales(locale)[0] === locale) {
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

/**
 * The locale a dictionary's name stands for, as a starting point: `en_AU` gives `en-AU`, `sr_Latn` gives `sr-Latn`,
 * `en_GB-legacy` gives `en-GB`, and `german` gives `de`. Undefined for names such as `ruby`.
 */
export function localeFromName(name: string): string | undefined {
    const parts = name.split(/[-_]/);
    const [language] = parts;
    if (language && /^[a-z]{2,3}$/i.test(language)) {
        // The longest start of the name that's a locale: a language, then a script or a region.
        const subtags = [language, ...parts.slice(1, 3).filter((_, i, all) => all.slice(0, i + 1).every(isSubtag))];
        for (let n = subtags.length; n >= 1; n--) {
            // A three-letter name alone is too often a word, such as "ada" or "lua".
            if (n === 1 && language.length === 3) break;
            const locale = canonical(subtags.slice(0, n).join('-'));
            if (locale && localeName(locale)) return locale;
        }
    }
    const spoken = name.toLowerCase().replaceAll(/[-_]/g, ' ');
    return knownLocales('en').find(({ name }) => name.toLowerCase() === spoken)?.locale;
}

/** A script, such as `Latn`, or a region, such as `AU` or `419`. */
function isSubtag(part: string): boolean {
    return /^([a-z]{4}|[a-z]{2}|\d{3})$/i.test(part);
}

function canonical(locale: string): string | undefined {
    try {
        return Intl.getCanonicalLocales(locale)[0];
    } catch {
        return undefined;
    }
}

/**
 * The name of the locale a dictionary's name stands for, when the whole name is that locale: "Australian English" for
 * `en_AU`, "English India" for `en_IN`, but nothing for `en_AU-legacy`, where the locale is only part of it.
 */
export function friendlyNameFromLocale(name: string): string | undefined {
    const locale = localeFromName(name);
    if (!locale) return undefined;
    const whole =
        canonical(name.replaceAll('_', '-'))?.toLowerCase() === locale.toLowerCase() ||
        localeName(locale)?.toLowerCase() === name.toLowerCase().replaceAll(/[-_]/g, ' ');
    // "English (India)" reads better as a title without the parentheses: "English India".
    return whole ? localeName(locale)?.replace(/ \((.+)\)$/, ' $1') : undefined;
}

/**
 * A dictionary name written the repo's way: words joined with `-`, all lowercase except a locale's region or script.
 * `Medical Terms` gives `medical-terms`, `en-au` gives `en_AU`, `en_gb-Legacy` gives `en_GB-legacy`, `German` gives
 * `german`, and `scientific_terms_gb` gives `scientific_terms_GB`.
 */
export function conventionalName(typed: string): string {
    const name = typed.trim().split(/\s+/).join('-');
    const locale = localeFromName(name);
    if (locale && canonical(name.replaceAll('_', '-'))?.toLowerCase() === locale.toLowerCase()) {
        return locale.replaceAll('-', '_');
    }
    // Words at even indexes, separators at odd ones.
    const parts = name.split(/([-_])/).map((part, i) => (i % 2 ? part : part.toLowerCase()));
    // A name that starts with a locale code, such as en_gb-Legacy.
    const subtags = locale?.split('-') ?? [];
    if (subtags[0] === parts[0]) subtags.forEach((subtag, k) => (parts[k * 2] = subtag));
    // A region at the end, such as scientific_terms_gb.
    const last = parts.length - 1;
    if (last >= 2 && parts[last - 1] === '_' && isRegion(parts[last])) parts[last] = parts[last].toUpperCase();
    return parts.join('');
}

const regionNames = new Intl.DisplayNames(['en'], { type: 'region', fallback: 'none' });

function isRegion(code: string): boolean {
    return /^[a-z]{2}$/i.test(code) && !!regionNames.of(code.toUpperCase());
}
