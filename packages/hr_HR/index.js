'use strict';

const configLocation = require.resolve('./cspell-ext.json');

function getConfigLocation() {
    return configLocation;
}

module.exports = {
    getConfigLocation,
};
