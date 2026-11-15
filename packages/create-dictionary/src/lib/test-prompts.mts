import assert from 'node:assert/strict';

import type { Prompts } from './questions.mts';

/** A question put to scripted prompts, with the answers its validator rejected. */
export interface Asked {
    message: string;
    default?: string;
    choices?: { value: unknown; checked?: boolean }[];
    rejected?: string[];
}

/** The answers scripted prompts give, in order, for each kind of prompt. */
export interface Script {
    input?: string[];
    confirm?: boolean[];
    checkbox?: string[][];
    select?: string[];
}

/**
 * Prompts for tests, answered from a script the way a person would type: an empty answer takes the default, and an
 * answer the validator rejects is recorded and followed by the next one. A question with no answer left fails the test.
 */
export function scriptedPrompts(script: Script, asked: Asked[] = []): Prompts {
    const answers = {
        input: [...(script.input ?? [])],
        confirm: [...(script.confirm ?? [])],
        checkbox: [...(script.checkbox ?? [])],
        select: [...(script.select ?? [])],
    };
    return {
        input: async ({ message, default: def, validate }) => {
            const question: Asked = { message, default: def };
            asked.push(question);
            for (;;) {
                const typed = next(answers.input, message);
                const value = typed || (def ?? '');
                if (!validate || (await validate(value)) === true) return value;
                question.rejected = [...(question.rejected ?? []), typed];
            }
        },
        confirm: async ({ message }) => {
            asked.push({ message });
            return next(answers.confirm, message);
        },
        checkbox: async <Value,>({ message, choices }: { message: string; choices: readonly unknown[] }) => {
            asked.push({ message, choices: choices as Asked['choices'] });
            return next(answers.checkbox, message) as Value[];
        },
        select: async <Value,>({ message }: { message: string }) => {
            asked.push({ message });
            return next(answers.select, message) as Value;
        },
    };
}

function next<T>(answers: T[], message: string): T {
    if (!answers.length) assert.fail(`no answer left for: ${message}`);
    return answers.shift() as T;
}
