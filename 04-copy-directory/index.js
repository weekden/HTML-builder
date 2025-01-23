const fs = require('fs');
const path = require('path');
const promises = require('fs/promises');
const copyDirectoryName = 'files-copy';
const sourceFolderPath = path.join(__dirname, './files');
const distanationFolderPath = path.join(__dirname, `./${copyDirectoryName}`);

(function copyFile() {
  promises.rm(distanationFolderPath, { recursive: true, force: true }).then(
    () => {
      fs.mkdir(distanationFolderPath, { recursive: true }, (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log(`Directory <${copyDirectoryName}> was created`);
        promises
          .readdir(sourceFolderPath, { withFileTypes: true })
          .then((files) =>
            files.forEach((file) => {
              if (file.isFile()) {
                const sourceFilePath = path.join(sourceFolderPath, file.name);
                const distanationFilePath = path.join(
                  distanationFolderPath,
                  file.name,
                );
                fs.copyFile(sourceFilePath, distanationFilePath, (err) => {
                  if (err) {
                    console.error(err);
                  }
                });
              }
            }),
          );
      });
    },
    (err) => console.error(err),
  );
})();
