import { remark } from 'remark';
import remarkGfm from 'remark-gfm';

/**
 * Format markdown
 */
export async function formatMarkdown(doc: string): Promise<string> {
    const vFile = await remark()
        .use(remarkGfm)
        .data('settings', { bullet: '-', emphasis: '_', strong: '*' })
        .process(doc);
    return String(vFile);
}
