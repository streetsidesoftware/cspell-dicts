#!/usr/bin/env node

// Shared helpers for the issue-to-pr proof-of-concept scripts.
// See docs/issue-to-pr-poc.md for the overall design.

import { appendFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';

/**
 * Write a (possibly multi-line) value to $GITHUB_OUTPUT using a random
 * delimiter so the value's own content can never prematurely close it.
 * No-ops outside of Actions (e.g. when running scripts locally for a demo).
 * @param {string} name
 * @param {string} value
 */
export function writeOutput(name, value) {
    const outputFile = process.env.GITHUB_OUTPUT;
    if (!outputFile) {
        console.log(`[output] ${name}=${value}`);
        return;
    }
    const delimiter = `EOF_${randomUUID()}`;
    appendFileSync(outputFile, `${name}<<${delimiter}\n${value}\n${delimiter}\n`);
}

/**
 * Report a fatal, user-facing error: log it as an Actions error annotation,
 * surface it as the `error` step output (so a later step can comment on the
 * issue with the reason), and exit non-zero.
 * @param {string} message
 * @returns {never}
 */
export function fail(message) {
    console.error(`::error::${message}`);
    writeOutput('error', message);
    process.exit(1);
}
