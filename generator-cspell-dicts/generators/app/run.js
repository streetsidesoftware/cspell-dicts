import { fileURLToPath } from 'node:url';
import { createEnv } from 'yeoman-environment';

import LocalGenerator from './index.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const namespace = 'cspell-dicts:app';

/**
 * Run the generator without using `yo`
 * @returns Promise<void>
 */
export async function run() {
    const env = createEnv();

    const options = {
        sharedData: {},
        forwardErrorToEnvironment: false,
        skipLocalCache: true,
        initialGenerator: true,
        env,
        resolved: __dirname + '/index.js',
        namespace,
    };

    const gen = new LocalGenerator(process.argv.slice(2), options);

    return env.runGenerator(gen);
}

// run();
