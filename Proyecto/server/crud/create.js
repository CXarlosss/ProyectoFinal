import fs from 'fs';
import { read } from './read.js';

export async function create(file, data, callback) {
  if (!fs.existsSync(file)) {
    fs.appendFile(file, '[]', function (err) {
      if (err) {
        console.log('create', err);
        return err;
      }
    })
  }
  return await insertData(file, data, callback);
}

async function insertData(file, data, callback) {
  let parsedData = []
  await read(file, (readData) => {
    parsedData = [...readData];
    if (!data.id) {
      const timestamp = new Date()
      data.id = String(timestamp.getTime())
    }
    parsedData.push(data);

    fs.writeFile(file, JSON.stringify(parsedData), function (err) {
      if (err) {
        console.log('insertData', err);
        return err;
      }
      if (callback) {
        return callback(data);
      }
    })
  });
  return data;
}