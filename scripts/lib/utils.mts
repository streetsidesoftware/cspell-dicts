/**
 * @param str - multi-line string to left pad
 * @param padding - the padding to use
 * @param firstLinePadding - optional padding of first line.
 */
export function padLines(str: string, padding = '', firstLinePadding = ''): string {
    let pad = firstLinePadding;
    const lines: string[] = [];
    for (const line of str.split('\n')) {
        lines.push(pad + line);
        pad = padding;
    }

    return lines.join('\n');
}
export function createTable(headers: string[], rows: string[][]): string {
    const colWidths: number[] = [];

    for (const row of [headers, ...rows]) {
        row.forEach((col, i) => {
            colWidths[i] = Math.max(colWidths[i] || 0, [...col].length);
        });
    }

    const rowPlaceholders = colWidths.map(() => '');
    const sep = headers.map((_, i) => '---'.padEnd(colWidths[i], '-'));
    const table = [headers, sep, ...rows];

    return table
        .map((row) => [...row, ...rowPlaceholders.slice(row.length)])
        .map((row) => row.map((col, i) => col.padEnd(colWidths[i])))
        .map((row) => `| ${row.join(' | ')} |`)
        .join('\n');
}
