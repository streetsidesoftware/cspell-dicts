// ts-check
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';

/**
 * Format markdown
 * @param {string} doc
 * @returns {Promise<string>}
 */
export async function formatMarkdown(doc) {
    const vFile = await remark()
        .use(remarkGfm)
        .data('settings', { bullet: '-', emphasis: '_', strong: '*' })
        .process(doc);
    return String(vFile);
}
