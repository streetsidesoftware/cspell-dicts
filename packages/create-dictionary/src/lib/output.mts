import { styleText } from 'node:util';

// Everything create-dictionary prints goes through here. Values are always arguments, never part of the format.

type Format = Parameters<typeof styleText>[0];

// styleText leaves the text plain when the stream isn't a terminal, or NO_COLOR is set.
const out = (format: Format, text: string) => styleText(format, text, { stream: process.stdout });
const err = (format: Format, text: string) => styleText(format, text, { stream: process.stderr });

/** Bold, for a title or the start of an important note. */
export const heading = (text: string) => out('bold', text);

/** Shows a title, then its lines. */
export function header(title: string, ...lines: string[]): void {
    console.log('\n%s\n\n%s', heading(title), lines.join('\n'));
}

/** Shows a section's title, such as "Section (1/6): Dictionary Info", after a blank line. */
export function section(title: string): void {
    console.log('\n%s', out(['bold', 'cyan'], title));
}

/**
 * Shows an explanation above a question, one line each, with a blank line before and after. Bright blue is a theme
 * color, so each theme keeps it readable on its background.
 */
export function explain(...lines: string[]): void {
    console.log('\n%s\n', out('blueBright', lines.join('\n')));
}

/** Shows a note on what the command did or decided. */
export function info(format: string, ...values: unknown[]): void {
    console.log(format, ...values);
}

/** Shows a file the command created. */
export function created(path: string): void {
    console.log('   %s %s', out('green', 'create'), path);
}

export function warn(message: string): void {
    console.warn('%s %s', err('yellow', 'warning:'), message);
}

export function fail(message: string): void {
    console.error('%s %s', err('red', 'error:'), message);
}

/** Ctrl+C at a prompt. */
export function stopped(): void {
    console.error('Stopped. Nothing was written.');
}
