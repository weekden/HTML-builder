const fs = require('fs');
const path = require('path');
const promises = require('fs/promises');
const { error } = require('console');
const bundleCssFileName = 'bundle.css';
const inputFolderPath = path.join(__dirname, './styles');
const outputFolderPath = path.join(__dirname, './project-dist');
const pathToBundleCssFile = path.join(outputFolderPath, bundleCssFileName);
(function createCssBundle() {
  fs.writeFile(pathToBundleCssFile, '', (err) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(`File '${bundleCssFileName}' was created`);
  });
  promises.readdir(inputFolderPath, { withFileTypes: true }).then(
    (files) => {
      const writeStream = fs.createWriteStream(pathToBundleCssFile, {
        encoding: 'utf8',
      });
      files.forEach((file) => {
        if (file.isFile() && file.name.slice(-4) === '.css') {
          const pathToFile = path.join(inputFolderPath, file.name);
          const readStream = fs.createReadStream(pathToFile, {
            encoding: 'utf8',
          });
          readStream.on('data', (chunk) => {
            writeStream.write(chunk);
          });
        }
      });
    },
    (err) => console.error(err),
  );
})();
