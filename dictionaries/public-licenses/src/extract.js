/**
 * Generate the list of public licenses based upon spdx-license-ids.
 */
const fs = require('fs/promises');
const path = require('path');
const ids = require('spdx-license-ids');

const filename = path.join(__dirname, './generated/public-licenses.txt');

function processIds() {
    const compare = new Intl.Collator().compare;

    const collection = new Set(ids);

    for (const line of ids) {
        const a = line
            .replace(/[.0-9]/g, ' ')
            .split(' ')
            .map((a) => a.replace(/^-+/, ''))
            .map((a) => a.replace(/-+$/, ''))
            .map((a) => a.replace(/^.{1,3}$/, ''))
            .filter((a) => !!a);
        a.forEach((w) => collection.add(w));
    }

    const words = [...collection].sort(compare);
    const text = `# Generated from spdx-license-ids
${words.join('\n')}

`;

    return fs.writeFile(filename, text, 'utf-8');
}

processIds();
