const fs = require('fs');
const path = require('path');
const copyDirectoryName = 'files-copy';
const sourceFolderPath = path.join(__dirname, './files');
const distanationFolderPath = path.join(__dirname, `./${copyDirectoryName}`);
(function copyFile() {
  fs.mkdir(distanationFolderPath, { recursive: true }, (err) => {
    if (err) console.error(err);
    console.log(`Directory <${copyDirectoryName}> was created`);
  });
  fs.readdir(sourceFolderPath, { withFileTypes: true }, (err, files) => {
    if (err) console.error(err);
    files.forEach((file) => {
      if (file.isFile()) {
        const sourceFilePath = path.join(sourceFolderPath, file.name);
        const distinationFilePath = path.join(distanationFolderPath, file.name);
        fs.copyFile(sourceFilePath, distinationFilePath, (err) => {
          if (err) console.error(err);
        });
      }
    });
  });
})();
