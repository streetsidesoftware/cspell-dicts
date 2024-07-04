import { pipeline } from 'node:stream';
import zlib from 'node:zlib';

export async function* autoDecompress(stream: AsyncIterable<Uint8Array>): AsyncIterable<Uint8Array> {
    const iter = stream[Symbol.asyncIterator]();

    try {
        const first = await iter.next();
        if (first.done) return;

        const isCompressed = first.value[0] === 0x1f && first.value[1] === 0x8b;

        if (!isCompressed) {
            yield* prefixAsyncIterator(first.value, iter);
            return;
        }

        yield* decompressGzip(prefixAsyncIterator(first.value, iter));
    } finally {
        iter.return?.();
    }
}

async function* decompressGzip(stream: AsyncIterable<Uint8Array>): AsyncIterable<Uint8Array> {
    const ac = new AbortController();

    try {
        const gzip = zlib.createGunzip();

        const p = pipeline(stream, gzip, (err) => {
            if (!err || err.name === 'AbortError') {
                return;
            }
            console.error(err);
        });

        yield* p;
    } finally {
        ac.abort();
    }
}

/**
 * Due to the nature of AsyncIterators, this function will NOT call iter.return()
 * @param value - value to yield first
 * @param iter - iterator to yield the rest
 * @returns AsyncIterable
 */
function prefixAsyncIterator<T>(value: T, iter: AsyncIterator<T>): AsyncIterable<T> {
    async function* run() {
        yield value;
        for (let n = await iter.next(); !n.done; n = await iter.next()) {
            yield n.value;
        }
    }
    return run();
}

export async function* decodeUtf8AsyncIterable(stream: AsyncIterable<Uint8Array>): AsyncIterable<string> {
    const decoder = new TextDecoder();

    for await (const block of stream) {
        yield decoder.decode(block, { stream: true });
    }
}

/**
 *
 * @param stream - AsyncIterable<string>
 */
export async function* toLinesAsync(stream: AsyncIterable<string>): AsyncIterable<string> {
    let buffer = '';

    for await (const chunk of stream) {
        buffer += chunk;
        const lines = buffer.split('\n');
        if (lines.length <= 1) continue;
        buffer = lines.pop() || '';
        yield* lines;
    }

    if (buffer.length > 0) {
        yield buffer;
    }
}
