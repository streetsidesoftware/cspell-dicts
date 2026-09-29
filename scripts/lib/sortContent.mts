const compare = Intl.Collator('en-US').compare;

/**
 * Sort the content of a source file, keeping comments together and sorting the rest.
 */
export function sortSourceContent(content: string): string {
    const lines = content.trim().split('\n');
    const groups: string[][] = [];
    let group = 0;

    function addLineToGroup(line: string): void {
        line = line.trim();
        if (!line) return;
        groups[group] = groups[group] || [];
        groups[group].push(line);
    }

    function addLine(line: string): void {
        if (line.startsWith('#')) {
            // One comment per group.
            if (groups[group]) {
                // Add an empty line in front of the first comment.
                groups[++group] = [];
                ++group;
            }
            groups[group++] = [line];
        } else {
            addLineToGroup(line);
        }
    }

    function removeCompoundPrefix(a: string): string {
        return a.replaceAll('*', '').replaceAll('+', '');
    }

    function compareWords(a: string, b: string): number {
        return compare(removeCompoundPrefix(a), removeCompoundPrefix(b)) || compare(a, b);
    }

    for (const line of lines) {
        addLine(line);
    }

    return (
        groups
            .map((a) => a.sort(compareWords).join('\n'))
            .join('\n')
            .trim() + '\n'
    );
}
