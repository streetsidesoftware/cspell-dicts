import { spawnSync } from 'node:child_process';
import { relative } from 'node:path';

import type { Repo } from './repo.mts';

/**
 * Install the new package's dependencies, then build it, as asked.
 */
export function setUpPackage(packageDir: string, repo: Repo, steps: { install: boolean; build: boolean }): void {
    if (steps.install) run(['install']);
    if (steps.build) {
        run(['run', 'build']);
        run(['run', 'prepare:dictionary']);
    }

    function run(args: string[]): void {
        const result = spawnSync('pnpm', args, {
            cwd: packageDir,
            stdio: 'inherit',
            shell: process.platform === 'win32',
        });
        if (result.status !== 0) {
            throw new Error(`pnpm ${args.join(' ')} failed in ${relative(repo.rootDir, packageDir)}`);
        }
    }
}
