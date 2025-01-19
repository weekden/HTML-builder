const fs = require('fs');
const path = require('path');
const bundleCssFileName = 'bundle.css';
const bundleHtmlFileName = 'index.html';

const inputFolderPath = path.join(__dirname, 'styles');
const outputFolderPath = path.join(__dirname, 'project-dist');

const sourceFolderPath = path.join(__dirname, 'assets');
const distanationFolderPath = path.join(outputFolderPath, 'assets');

// Ceate css bundle file
fs.writeFile(outputFolderPath, bundleCssFileName, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(`File '${bundleCssFileName}' was created`);
});
fs.readdir(inputFolderPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.log(err);
    return;
  }
  const pathToBundleCssFile = path.join(outputFolderPath, bundleCssFileName);
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
// Copy assets folder in dist folder
copyFile(sourceFolderPath, distanationFolderPath);

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
      } else if (file.isDirectory())
        copyFile(sourceFilePath, distinationFilePath);
    });
  });
}

function findElemInChunk(_chunk, arr) {
  const findedElem = arr.find((elem) =>
    _chunk.toLowerCase().includes(elem.toLowerCase()),
  );
  return findedElem;
}
function createHtml() {
  const readStream = fs.createReadStream(
    path.join(__dirname, 'template.html'),
    {
      encoding: 'utf8',
    },
  );

  let htmlStr = '';

  readStream.on('data', (chunk) => (htmlStr = `${htmlStr}${chunk}`));

  readStream.on('end', () => {
    const writeStream = fs.createWriteStream(
      path.join(outputFolderPath, bundleHtmlFileName),
      {
        encoding: 'utf8',
      },
    );
    fs.readdir(
      path.join(__dirname, 'components'),
      { withFileTypes: true },
      (err, files) => {
        if (err) console.error(err);
        const componentsFileNameArr = [];
        files.forEach((file) => {
          const fileName = file.name.slice(0, file.name.length - 5);
          const pathToFile = path.join(__dirname, 'components', file.name);
          const nameInHtml = `{{${fileName}}}`;
          componentsFileNameArr.push(nameInHtml);
          if (htmlStr.includes(nameInHtml)) {
            console.log(nameInHtml);
            let str = '';
            const readStream = fs.createReadStream(pathToFile, {
              encoding: 'utf8',
            });
            readStream.on('data', (text) => (str = `${str}${text}`));
            readStream.on('end', () => {
              console.log(typeof str);
              htmlStr.replaceAll(nameInHtml, str);
              console.log(typeof htmlStr);
            });
          }
          writeStream.write(htmlStr);
        });
      },
    );
  });
  // readStream.on('data', (chunk) => {
  //   htmlStr = `${htmlStr}${chunk}`;
  //   fs.readdir(
  //     path.join(__dirname, 'components'),
  //     { withFileTypes: true },
  //     (err, files) => {
  //       if (err) console.error(err);
  //       files.forEach((file) => {
  //         const fileName = file.name.slice(0, file.name.length - 5);
  //         const pathToFile = path.join(__dirname, 'components', file.name);
  //         const nameInHtml = `{{${fileName}}}`;

  //         if (chunk.toString().includes(nameInHtml)) {
  //           console.log(nameInHtml);
  //           let str = '';
  //           const readStream = fs.createReadStream(pathToFile, {
  //             encoding: 'utf8',
  //           });
  //           readStream.on('data', (text) => (str = `${str}${text}`));
  //           readStream.on('end', () => {
  //             htmlStr = htmlStr.replaceAll(nameInHtml, str);
  //           });
  //         }
  //         writeStream.write(htmlStr);
  //       });
  //     },
  //   );
  // });
}
createHtml();
// function readDirFileNames(directory) {
//   fs.readdir(directory, { withFileTypes: true }, (err, files) => {
//     if (err) console.error(err);
//     files.forEach((file) => arr.push(file.name.slice(0, file.name.length - 5)));
//     console.log(arr);
//   });
// }
// console.log(readDirFileNames(path.join(__dirname, 'components')));

// const pathToBundleHtmlFile = path.join(outputFolderPath, bundleHtmlFileName);
// let htmlFile = '';
// const readStream = fs.createReadStream(path.join(__dirname, 'template.html'), {
//   encoding: 'utf8',
// });
// readStream.on('data', (chunk) => {
//   htmlFile = `${htmlFile}${chunk}`;
// });
// readStream.on('end', () => {
//   console.log(htmlFile);
// });

// fs.writeFile(pathToBundleHtmlFile, '', (err) => {
//   const componentsFileNameArr = [];
//   if (err) {
//     console.error(err);
//     return;
//   }
//   console.log(`File '${bundleHtmlFileName}' was created`);

//   fs.readdir(
//     path.join(__dirname, 'components'),
//     { withFileTypes: true },
//     (err, files) => {
//       if (err) console.error(err);
//       files.forEach((file) => {
//         const dotIndex = file.name.lastIndexOf('.');
//         const fileName = file.name.slice(0, dotIndex);
//         componentsFileNameArr.push[fileName];
//       });
//     },
//   );

//   const readStream = fs.createReadStream(
//     path.join(__dirname, 'template.html'),
//     {
//       encoding: 'utf8',
//     },
//   );
//   // // const writeStream = fs.createWriteStream(pathToBundleHtmlFile, {
//   // //   encoding: 'utf8',
//   // // });
//   readStream.on('data', (chunk) => {
//     // if (findElemInChunk(chunk, componentsFileNameArr)) {
//     console.log(chunk);
//     console.log(componentsFileNameArr);
//     // }
//   });
// });

const a = ['aaaaaaaaaaaa', 'bbbbbbbbbbbbbbbbbb', 'cccccccccccccccc'];

console.log(a.map((file) => file.slice(0, file.length - 5)));

const b = '{{ red }}';
console.log(b.trim());
