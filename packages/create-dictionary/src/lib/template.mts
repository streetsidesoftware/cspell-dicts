/**
 * Replace each `<%= key %>` with its value, escaped for the file type.
 */
export function fillTemplate(template: string, values: Record<string, string>, ext: string): string {
    return template.replaceAll(/<%= (\w+) %>/g, (_, key: string) => {
        const value = values[key];
        if (value === undefined) throw new Error(`Unknown template value: ${key}`);
        if (ext === '.json') return JSON.stringify(value).slice(1, -1);
        if (ext === '.yaml') return value.replaceAll("'", "''");
        return value;
    });
}
