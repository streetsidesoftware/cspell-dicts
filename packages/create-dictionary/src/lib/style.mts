import { styleText } from 'node:util';

type Format = Parameters<typeof styleText>[0];

// styleText leaves the text plain when the stream isn't a terminal, or NO_COLOR is set.
const out = (format: Format, text: string) => styleText(format, text, { stream: process.stdout });
const err = (format: Format, text: string) => styleText(format, text, { stream: process.stderr });

/** The header's title, or the start of an important note. */
export const heading = (text: string) => out('bold', text);

/** A section's title, such as "Section (1/7): Dictionary Info". */
export const sectionTitle = (text: string) => out(['bold', 'cyan'], text);

/** An explanation above a question. Bright blue is a theme color, so each theme keeps it readable on its background. */
export const explain = (text: string) => out('blueBright', text);

/** A file the command created. */
export const created = (text: string) => out('green', text);

export function warn(message: string): void {
    console.warn('%s %s', err('yellow', 'warning:'), message);
}

export function fail(message: string): void {
    console.error('%s %s', err('red', 'error:'), message);
}
