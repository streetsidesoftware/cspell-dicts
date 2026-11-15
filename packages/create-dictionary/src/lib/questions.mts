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

export function createQuestions(given: Answers, noPrompts: boolean, prompts: Prompts): Questions {
    return new Questions(given, noPrompts, prompts);
}

/** Answers from the options, then defaults or prompts, shown under the current section's title. */
export class Questions {
    readonly given: Answers;
    readonly noPrompts: boolean;
    /** The prompts, each showing the pending section title first. */
    readonly ask: Prompts;
    #pendingSection: string | undefined;

    constructor(given: Answers, noPrompts: boolean, prompts: Prompts) {
        this.given = given;
        this.noPrompts = noPrompts;
        this.ask = {
            input: (config) => (this.showSection(), prompts.input(config)),
            confirm: (config) => (this.showSection(), prompts.confirm(config)),
            checkbox: (config) => (this.showSection(), prompts.checkbox(config)),
            select: (config) => (this.showSection(), prompts.select(config)),
        };
    }

    /** Starts a section; its title is shown before its first question, so a section answered by options shows none. */
    section(n: number, title: string): void {
        // Without prompts there are no sections to show.
        this.#pendingSection = this.noPrompts ? undefined : `Section (${n}/${sectionCount}): ${title}`;
    }

    showSection(): void {
        if (this.#pendingSection) showSectionTitle(this.#pendingSection);
        this.#pendingSection = undefined;
    }

    /** A note within the current section, under its title. */
    info(format: string, ...values: unknown[]): void {
        this.showSection();
        showInfo(format, ...values);
    }

    async text(key: TextKey, message: string, def?: string, validate?: Validate): Promise<string> {
        const value = this.given[key] ?? (this.noPrompts ? def : undefined);
        if (value === undefined && !this.noPrompts) return this.ask.input({ message, default: def, validate });
        const valid = validate?.(value ?? '') ?? true;
        if (valid !== true) throw new Error(`${optionForAnswer[key]}: ${valid}`);
        return value ?? '';
    }

    /** Asks a yes/no question, with an optional explanation on the line above it. */
    async yesNo(key: BooleanKey, message: string, def: boolean, intro?: string): Promise<boolean> {
        const value = this.given[key] ?? (this.noPrompts ? def : undefined);
        if (value !== undefined) return value;
        this.showSection();
        if (intro) explain(intro);
        return this.ask.confirm({ message, default: def });
    }
}
