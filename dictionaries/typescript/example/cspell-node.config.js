const determinePackageNamesAndMethods = require('./readPackageInfo').determinePackageNamesAndMethods;

module.exports = {
    words: determinePackageNamesAndMethods().packageNames,
};
