const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, 'text.txt');
const writeStream = fs.createWriteStream(filePath, { encoding: 'utf8' });
const rl = readline.createInterface(process.stdin, process.stdout);

const endWriting = () => {
  writeStream.end();
  rl.close();
  console.log('Exit. File writing completed file saved');
};

rl.question(
  'Enter your message (write "exit" or push CTRL+C for exit) \n',
  (inputText) => {
    if (inputText.toLowerCase().trim() === 'exit') {
      endWriting();
    } else {
      writeStream.write(inputText + '\n');
      rl.on('line', (inputText) => {
        if (inputText.toLowerCase().trim() === 'exit') {
          endWriting();
        } else {
          writeStream.write(inputText + '\n');
        }
      });
    }
  },
);

rl.on('SIGINT', () => {
  endWriting();
});
