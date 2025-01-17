const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(filePath, { encoding: 'utf8' });
let result = '';
readStream.on('data', (chunk) => {
  result = `${result}${chunk}`;
});
readStream.on('error', (err) => console.error(err));
readStream.on('end', () => {
  console.log(result);
});
