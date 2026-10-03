import { fileURLToPath } from 'node:url';
import { createEnv } from 'yeoman-environment';

import LocalGenerator from './index.js';
import { parseCommandLine } from './options.mts';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const namespace = 'cspell-dicts:app';

/**
 * Run the generator without using `yo`
 * @returns Promise<void>
 */
export async function run() {
    const { answers, yes } = parseCommandLine(process.argv.slice(2));

    const env = createEnv();

    const options = {
        sharedData: {},
        forwardErrorToEnvironment: false,
        skipLocalCache: true,
        initialGenerator: true,
        env,
        resolved: __dirname + '/index.js',
        namespace,
        answers,
        yes,
    };

    const gen = new LocalGenerator([], options);

    try {
        await env.runGenerator(gen);
    } catch (e) {
        console.error(e instanceof Error ? e.message : e);
        process.exitCode = 1;
    }
}

// run();
