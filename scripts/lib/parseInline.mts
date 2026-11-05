import * as md from '@streetsidesoftware/markdown-toolkit';

/** Descriptions are Markdown, such as `Matches on HTML symbols like \`&clubs;\``. */
export function parseInline(markdown: string): md.InlineContent {
    const parsed = md.parse(markdown);
    if (parsed.type !== 'inlineFragment') throw new Error(`Expected one line of Markdown: ${markdown}`);
    return parsed;
}
