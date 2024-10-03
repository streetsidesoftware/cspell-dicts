const fs = require('fs');
const path = require('path');

/**
 * Search for `package.json`
 * @param {string} from - search `from` directory.
 * @returns {string} - path to package.json
 */
function findNearestPackageJson(from) {
    from = path.resolve(from);
    const parent = path.dirname(from);
    if (!from || parent === from) {
        return;
    }

    const pkg = path.join(from, 'package.json');
    if (fs.existsSync(pkg)) {
        return pkg;
    }
    return findNearestPackageJson(parent);
}

/**
 * Load the nearest package.json
 * @param {string} pkgFile
 * @returns
 */
function loadPackage(pkgFile) {
    if (!pkgFile) return;
    return JSON.parse(fs.readFileSync(pkgFile, 'utf-8'));
}

function determinePackageNamesAndMethods(cwd = process.cwd()) {
    const pkgFile = findNearestPackageJson(cwd);
    const pkg = loadPackage(pkgFile) || {};
    const packageNames = Object.keys(pkg.dependencies || {}).concat(Object.keys(pkg.devDependencies || {}));
    return { pkgFile, packageNames };
}

module.exports = {
    determinePackageNamesAndMethods,
};
