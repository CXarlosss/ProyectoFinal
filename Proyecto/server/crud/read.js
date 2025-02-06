import fs from 'fs';

export async function read(file, callback) {
  let parsedData = []
  try {
    if (fs.existsSync(file)) {
      await fs.readFile(file, function (err, data) {
        parsedData = JSON.parse(data.toString());
        if (err) {
          console.log('read', err);
          return err;
        }
        if (callback && !err) {
          return callback(parsedData);
        }
      });
    } else {
      console.log('read', 'El fichero no existe');
      if (callback) {
        return callback('El fichero no existe');
      }
    }
  } catch (err) {
    console.log('read', `Error: ${err}`);
    return err;
  }
}