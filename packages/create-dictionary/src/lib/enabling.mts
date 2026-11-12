import { findLocales, knownLocales, localeFromWholeName, localeName, localeWarnings } from './locales.mts';
import type { Answers } from './options.mts';
import { literal, warn } from './output.mts';
import type { Questions } from './questions.mts';
import { validateLanguageId } from './validate.mts';

export interface Enabling {
    languageSettings: boolean;
    locale: string;
    languageId: string;
}

type Kind = 'language' | 'files';

const fileTypesMessage =
    'File types, the programming languages or file types it is for, comma separated, such as "ruby" or "markdown":';

/** How the dictionary is enabled, from the options and the name, asking what they leave open. */
export async function askEnabling(
    name: string,
    given: Answers,
    languageSettingsAllowed: boolean,
    questions: Questions,
): Promise<Enabling> {
    const { noPrompts, info } = questions;
    const nameLocale = localeGivenByName(name, given);
    const languageSettings = languageSettingsAllowed && usesLanguageSettings(given, nameLocale, noPrompts);
    if (nameLocale && (noPrompts || !languageSettings)) {
        info('The locale is %s, from the name. Give %s to change it.', literal(nameLocale), literal('--locale'));
    }
    if (!languageSettings) {
        const locale = await checkedLocale(given.locale ?? nameLocale ?? '*', given, questions);
        return { languageSettings, locale, languageId: given.languageId ?? '*' };
    }
    const kind = kindFromOptions(given, nameLocale) ?? (noPrompts ? 'files' : await askKind(questions));
    if (kind === 'files') {
        // Without prompts and without a file type, the locale was typed as "*", so this default makes both "*".
        const languageId = await questions.text(
            'languageId',
            fileTypesMessage,
            noPrompts ? '*' : undefined,
            validateLanguageId(true),
        );
        return { languageSettings, locale: '*', languageId };
    }
    const locale = await askLocale(nameLocale, given, questions);
    const languageId =
        given.languageId === undefined
            ? '*'
            : await questions.text('languageId', fileTypesMessage, undefined, validateLanguageId(false));
    return { languageSettings, locale, languageId };
}

/**
 * The locale a name such as en_AU or german gives, unless an option says otherwise: `--locale`, or a file type, which
 * says it isn't for a natural language, so `en_IN --language-id erlang` gets none.
 */
export function localeGivenByName(name: string, given: Answers): string | undefined {
    if (given.locale !== undefined || isSet(given.languageId)) return undefined;
    return localeFromWholeName(name);
}

/** A typed "*" counts, so it reaches the check that the two aren't both "*". */
export function usesLanguageSettings(given: Answers, nameLocale: string | undefined, noPrompts: boolean): boolean {
    return given.locale !== undefined || given.languageId !== undefined || !!nameLocale || !noPrompts;
}

/** Undefined when the options and the name leave the kind open. */
export function kindFromOptions(given: Answers, nameLocale: string | undefined): Kind | undefined {
    if (isSet(given.locale) || nameLocale) return 'language';
    if (isSet(given.languageId) || given.locale !== undefined) return 'files';
    return undefined;
}

function isSet(value: string | undefined): boolean {
    return value !== undefined && value.trim() !== '*';
}

function askKind({ ask }: Questions): Promise<Kind> {
    return ask.select<Kind>({
        message: 'What is this dictionary for?',
        choices: [
            { name: 'A natural language, such as German or Australian English', value: 'language' },
            { name: 'Programming languages or file types, such as Ruby or Markdown', value: 'files' },
        ],
    });
}

/**
 * The locale. When the name stands for a language and the locale is asked, its locales are offered as a checklist, with
 * the one from the name ticked; "Something else" asks for it as text.
 */
async function askLocale(nameLocale: string | undefined, given: Answers, questions: Questions): Promise<string> {
    const { ask, noPrompts } = questions;
    if (!nameLocale || noPrompts) return typedLocale(nameLocale, given, questions);
    const language = nameLocale.split('-')[0];
    const related = knownLocales().filter(({ locale }) => locale === language || locale.startsWith(language + '-'));
    if (!related.some(({ locale }) => locale === nameLocale)) {
        related.unshift({ locale: nameLocale, name: localeName(nameLocale) ?? nameLocale });
    }
    const other = '';
    const choices = [
        ...related.map(({ locale, name }) => ({
            name: `${locale}: ${name}`,
            value: locale,
            checked: locale === nameLocale,
        })),
        { name: 'Something else (type it)', value: other },
    ];
    const picked = await ask.checkbox({ message: 'Locales for this dictionary:', choices });
    const locales = picked.filter((locale) => locale !== other);
    if (picked.includes(other) || !locales.length) {
        locales.push(await typedLocale(locales.length ? '' : undefined, given, questions));
    }
    return locales.join(',');
}

async function typedLocale(def: string | undefined, given: Answers, questions: Questions): Promise<string> {
    const value = await questions.text(
        'locale',
        'Locales, the natural languages it is for, comma separated, such as "en,en-US", or names such as "English":',
        def,
        (v) => (v.trim() && v.trim() !== '*') || 'Give a locale or a language name.',
    );
    return checkedLocale(value, given, questions);
}

/**
 * The locale, with each item that isn't a known locale offered as the locales its name could mean, when it was typed at
 * the prompt. Anything still unknown is a warning, not an error: cspell takes any locale.
 */
async function checkedLocale(value: string, given: Answers, { ask, noPrompts }: Questions): Promise<string> {
    let locale = value;
    if (!noPrompts && given.locale === undefined) {
        const items: string[] = [];
        for (const item of value.split(',').map((each) => each.trim())) {
            const matches = item === '*' || localeName(item) ? [] : findLocales(item);
            if (!matches.length) {
                items.push(item);
                continue;
            }
            const choices = matches.map(({ locale, name, ownName }) => ({
                name: `${locale}: ${ownName ? `${ownName}, ${name}` : name}`,
                value: locale,
            }));
            const message = `"${item}" isn't a locale. Pick the ones you meant (none keeps "${item}"):`;
            const picked = await ask.checkbox({ message, choices });
            items.push(...(picked.length ? picked : [item]));
        }
        locale = items.join(',');
    }
    for (const warning of localeWarnings(locale)) warn(warning);
    return locale;
}
