function fileNameToModuleName(filePath) {
  return filePath.replace(/\\/g, '/')
    // module name should be relative to `client` folder
    .replace(/.*\/base\//, '')
    .replace(/.*\/client\//, '')
    .replace(/.*\/tools\//, '')
    // module name should not include `src`, `test`, `lib`
    .replace(/\/src\//, '/')
    .replace(/\/lib\//, '/')
    // module name should not have a suffix
    .replace(/\.\w*$/, '');
}
if (typeof module !== 'undefined') {
  module.exports = fileNameToModuleName;
}
