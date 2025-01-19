const fs = require('fs');
const path = require('path');
const bundleCssFileName = 'bundle.css';
const inputFolderPath = path.join(__dirname, './styles');
const outputFolderPath = path.join(__dirname, './project-dist');
const pathToBundleCssFile = path.join(outputFolderPath, bundleCssFileName);

fs.writeFile(pathToBundleCssFile, '', (err) => {
  if (err) {
    console.log(err);
    return;
  }
  fs.readdir(inputFolderPath, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.log(err);
      return;
    }
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
  });
  console.log(`File '${bundleCssFileName}' was created`);
});
