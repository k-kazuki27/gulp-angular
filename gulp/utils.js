'use strict';

module.exports = {
    endsWith: endsWith,
    isLintFixed: isLintFixed
};

function endsWith(str, suffix) {
    return str.indexOf('/', str.length - suffix.length) !== -1;
}


function isLintFixed(file) {
    // Has ESLint fixed the file contents?
    return file.eslint !== null && file.eslint.fixed;
}