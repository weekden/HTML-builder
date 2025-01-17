const fs = require('fs');
const path = require('path');
const folderPath = path.join(__dirname, './secret-folder');
fs.readdir(folderPath, { withFileTypes: true }, (err, file) => {
  if (err) {
    console.error(err);
    return;
  }
  file.forEach((item) => {
    if (item.isFile()) {
      let resultInfo = '';
      const dotIndex = item.name.lastIndexOf('.');
      const fileName = item.name.slice(0, dotIndex);
      const extFileName = item.name.slice(dotIndex + 1);
      const filePath = path.join(folderPath, item.name);

      fs.stat(filePath, (error, info) => {
        if (error) {
          console.error(error);
          return;
        }
        const fileSize = info.size;
        resultInfo = `${fileName} - ${extFileName} - ${fileSize} kb`;
        console.log(resultInfo);
      });
    }
  });
});
