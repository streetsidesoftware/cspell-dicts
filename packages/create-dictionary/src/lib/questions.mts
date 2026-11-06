import { checkbox, confirm, input, select } from '@inquirer/prompts';

import { optionForAnswer } from './options.mts';
import type { Answers } from './options.mts';
import { explain, info as showInfo, section as showSectionTitle } from './output.mts';
import type { Validate } from './validate.mts';

/** The sections the questions are grouped in, as in the help. */
export const sectionCount = 6;

/** The prompts a question is put through. Tests give their own. */
export interface Prompts {
    input(config: Parameters<typeof input>[0]): Promise<string>;
    confirm(config: Parameters<typeof confirm>[0]): Promise<boolean>;
    checkbox<Value>(config: Parameters<typeof checkbox<Value>>[0]): Promise<Value[]>;
    select<Value>(config: Parameters<typeof select<Value>>[0]): Promise<Value>;
}

export const terminalPrompts: Prompts = { input, confirm, checkbox, select };

type TextKey = { [K in keyof Answers]-?: Answers[K] extends string | undefined ? K : never }[keyof Answers];
type BooleanKey = { [K in keyof Answers]-?: Answers[K] extends boolean | undefined ? K : never }[keyof Answers];

/** Answers from the options, then defaults or prompts, shown under the current section's title. */
export interface Questions {
    noPrompts: boolean;
    ask: Prompts;
    /** Starts a section; its title is shown before its first question, so a section answered by options shows none. */
    section(n: number, title: string): void;
    showSection(): void;
    /** A note within the current section, under its title. */
    info(format: string, ...values: unknown[]): void;
    text(key: TextKey, message: string, def?: string, validate?: Validate): Promise<string>;
    /** Asks a yes/no question, with an optional explanation on the line above it. */
    yesNo(key: BooleanKey, message: string, def: boolean, intro?: string): Promise<boolean>;
}

export function createQuestions(given: Answers, noPrompts: boolean, prompts: Prompts): Questions {
    let pendingSection: string | undefined;

    const ask: Prompts = {
        input: (config) => (showSection(), prompts.input(config)),
        confirm: (config) => (showSection(), prompts.confirm(config)),
        checkbox: (config) => (showSection(), prompts.checkbox(config)),
        select: (config) => (showSection(), prompts.select(config)),
    };

    return { noPrompts, ask, section, showSection, info, text, yesNo };

    function section(n: number, title: string): void {
        // Without prompts there are no sections to show.
        pendingSection = noPrompts ? undefined : `Section (${n}/${sectionCount}): ${title}`;
    }

    function showSection(): void {
        if (pendingSection) showSectionTitle(pendingSection);
        pendingSection = undefined;
    }

    function info(format: string, ...values: unknown[]): void {
        showSection();
        showInfo(format, ...values);
    }

    async function text(key: TextKey, message: string, def?: string, validate?: Validate): Promise<string> {
        const value = given[key] ?? (noPrompts ? def : undefined);
        if (value === undefined && !noPrompts) return ask.input({ message, default: def, validate });
        const valid = validate?.(value ?? '') ?? true;
        if (valid !== true) throw new Error(`${optionForAnswer[key]}: ${valid}`);
        return value ?? '';
    }

    async function yesNo(key: BooleanKey, message: string, def: boolean, intro?: string): Promise<boolean> {
        const value = given[key] ?? (noPrompts ? def : undefined);
        if (value !== undefined) return value;
        showSection();
        if (intro) explain(intro);
        return ask.confirm({ message, default: def });
    }
}
