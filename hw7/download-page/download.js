import { get } from 'https';
import { mkdirSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const downloadPage = (url = 'https://www.google.com/') => {
  console.log('downloading', url);

  // fetchPage(urlF, (err, html)) — simple GET + buffer
  const fetchPage = (urlF, callback) => {
    get(urlF, (response) => {
      let buff = '';
      response.on('data', (chunk) => (buff += chunk));
      response.on('end', () => callback(null, buff));
    }).on('error', (error) => {
      console.error(`Got error: ${error.message}`);
      callback(error);
    });
  };

  const folderName = uuidv4();
  const outDir = path.join(__dirname, folderName);
  mkdirSync(outDir);

  fetchPage(url, (error, data) => {
    if (error) return console.log(error);
    writeFileSync(path.join(outDir, 'url.txt'), url, 'utf8');
    writeFileSync(path.join(outDir, 'file.html'), data, 'utf8');
    console.log('downloading is done in folder', folderName);
  });
};

downloadPage(process.argv[2]);
