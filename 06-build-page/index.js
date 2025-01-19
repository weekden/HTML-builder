const fs = require('fs');
const promises = require('fs/promises');
const path = require('path');
const bundleCssFileName = 'style.css';
const bundleHtmlFileName = 'index.html';

const inputFolderPath = path.join(__dirname, 'styles');
const outputFolderPath = path.join(__dirname, 'project-dist');

const sourceFolderPath = path.join(__dirname, 'assets');
const distanationFolderPath = path.join(outputFolderPath, 'assets');

// Ceate css bundle file
(function createCssBumdleFile() {
  fs.mkdir(outputFolderPath, { recursive: true }, (err) => {
    if (err) console.error(err);
    console.log('Directory <project-dist> was created');
  });
  fs.writeFile(path.join(outputFolderPath, bundleCssFileName), '', (err) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(`File '${bundleCssFileName}' was created`);
  });
  promises.readdir(inputFolderPath, { withFileTypes: true }).then(
    (files) => {
      const pathToBundleCssFile = path.join(
        outputFolderPath,
        bundleCssFileName,
      );
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
    (err) => console.log(err),
  );
})();

// Copy assets folder in dist folder
copyFile(sourceFolderPath, distanationFolderPath);

// Ceate HTML bundle file
(function createHtml() {
  const readStream = fs.createReadStream(
    path.join(__dirname, 'template.html'),
    {
      encoding: 'utf8',
    },
  );
  let htmlStr = '';

  readStream.on('data', (chunk) => (htmlStr = `${htmlStr}${chunk}`));
  readStream.on('end', () => {
    promises
      .readdir(path.join(__dirname, 'components'), { withFileTypes: true })
      .then(
        (files) => {
          const componentsFileNameArr = [];
          files.forEach((file) => {
            if (file.isFile() && file.name.slice(-5) === '.html')
              componentsFileNameArr.push(file);
          });
          componentsFileNameArr.forEach((file, index) => {
            const fileName = file.name.slice(0, file.name.length - 5);
            const pathToFile = path.join(__dirname, 'components', file.name);
            const nameInHtml = `{{${fileName}}}`;

            if (htmlStr.includes(nameInHtml)) {
              let str = '';
              const readStream = fs.createReadStream(pathToFile, {
                encoding: 'utf8',
              });

              readStream.on('data', (text) => (str = `${str}${text}`));
              readStream.on('end', () => {
                htmlStr = htmlStr.replaceAll(nameInHtml, str);
                if (index === componentsFileNameArr.length - 1) {
                  const writeStream = fs.createWriteStream(
                    path.join(outputFolderPath, bundleHtmlFileName),
                    { encoding: 'utf8' },
                  );
                  console.log(`File '${bundleHtmlFileName}' was created`);
                  writeStream.write(htmlStr);
                }
              });
            }
          });
        },
        (err) => console.error(err),
      );
  });
})();

function copyFile(srcFolder, distFolder) {
  fs.mkdir(distFolder, { recursive: true }, (err) => {
    if (err) console.error(err);
  });
  fs.readdir(srcFolder, { withFileTypes: true }, (err, files) => {
    if (err) console.error(err);
    files.forEach((file) => {
      const sourceFilePath = path.join(srcFolder, file.name);
      const distinationFilePath = path.join(distFolder, file.name);

      if (file.isFile()) {
        fs.copyFile(sourceFilePath, distinationFilePath, (err) => {
          if (err) console.error(err);
        });
      } else if (file.isDirectory()) {
        copyFile(sourceFilePath, distinationFilePath);
      }
    });
  });
}
