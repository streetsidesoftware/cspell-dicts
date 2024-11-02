const compare = Intl.Collator('en-US').compare;

export function sortSourceContent(content) {
    const lines = content.trim().split('\n');
    const groups = [];
    let group = 0;

    /**
     *
     * @param {string} line
     * @returns {void}
     */
    function addLineToGroup(line) {
        line = line.trim();
        if (!line) return;
        groups[group] = groups[group] || [];
        groups[group].push(line);
    }

    /**
     *
     * @param {string} line
     * @returns {void}
     */
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

    /**
     *
     * @param {string} a
     * @returns
     */
    function removeCompoundPrefix(a) {
        return a.replaceAll('*', '').replaceAll('+', '');
    }

    /**
     *
     * @param {string} a
     * @param {string} b
     * @returns {number}
     */
    function compareWords(a, b) {
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
