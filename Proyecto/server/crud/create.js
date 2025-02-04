import fs from 'fs';
import { read } from './read.js';

export function create(file, data, callback) {
  console.log('create', file, data)
  if (!fs.existsSync(file)) {
    fs.appendFile(file, '[]', function (err) {
      if (err) {
        console.log('create', err);
        return;
      }
    })
  }
  insertData(file, data, callback);
}

async function insertData(file, data, callback) {
  console.log('insertData', data, file);
  let parsedData = []
  await read(file, (readData) => {
    parsedData = [...readData];
    console.log('insertData parsedData', parsedData);
    parsedData.push(data);

    fs.writeFile(file, JSON.stringify(parsedData), function (err) {
      if (err) {
        console.log('insertData', err);
        return;
      }
      if (callback) {
        callback(data);
      }
    })
  });
}