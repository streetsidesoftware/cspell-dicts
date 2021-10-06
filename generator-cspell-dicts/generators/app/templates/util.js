'use strict';

// Cspell:word configstore
const Configstore = require('configstore');

const packageName = 'cspell';
const importPath = 'import';
const configLocation = require.resolve('./cspell-ext.json');

/**
 *
 * @param {Configstore} conf
 * @returns {string[]}
 */
function getImports(conf) {
    const imports = conf.get(importPath) || [];

    if (typeof imports === 'string') {
        return [imports];
    }

    return imports;
}

function install() {
    const conf = new Configstore(packageName);
    const imports = getImports(conf);
    if (imports.indexOf(configLocation) < 0) {
        imports.push(configLocation);
        conf.set(importPath, imports);
    }
}

function uninstall() {
    const conf = new Configstore(packageName);
    const imports = getImports(conf);
    const index = imports.indexOf(configLocation);
    if (index >= 0) {
        imports.splice(index, 1);
        conf.set(importPath, imports);
    }
}

module.exports = {
    install,
    uninstall,
    configLocation,
};
