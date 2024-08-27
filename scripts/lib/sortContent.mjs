const compare = Intl.Collator('en-US').compare;

export function sortSourceContent(content) {
    const lines = content.trim().split('\n');
    const groups = [];
    let group = 0;

    function addLineToGroup(line) {
        line = line.trim();
        if (!line) return;
        groups[group] = groups[group] || [];
        groups[group].push(line);
    }

    function addLine(line) {
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

    for (const line of lines) {
        addLine(line);
    }

    return (
        groups
            .map((a) => a.sort(compare).join('\n'))
            .join('\n')
            .trim() + '\n'
    );
}
