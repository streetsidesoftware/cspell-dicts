// ts-check
import { writeFile } from 'fs/promises';

const files = [
    {
        url: 'https://raw.githubusercontent.com/bataak/dict-mn/main/mn_MN/mn_MN.aff',
        output: new URL('index.aff', import.meta.url)
    },
    {
        url: 'https://raw.githubusercontent.com/bataak/dict-mn/main/mn_MN/mn_MN.dic',
        output: 'index.dic'
    }
];

async function downloadFile(url, output) {
    console.log(`Downloading ${url} → ${output}`);
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }
    const data = await response.bytes();
    await writeFile(output, data);
    console.log(`Saved to ${output}`);
}

(async () => {
    try {
        for (const file of files) {
            await downloadFile(file.url, file.output);
        }
        console.log('✅ All files downloaded.');
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
})();
