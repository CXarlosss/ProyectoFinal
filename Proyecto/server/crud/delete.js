import fs from 'fs';

export async function deleteById(file, id, callback) {
  try {
    if (fs.existsSync(file)) {
      await fs.readFile(file, function (err, data) {
        const parsedData = JSON.parse(data.toString());
        // Filter by filterParams
        const updatedData = parsedData.filter((item) => {
          return item.id !== id
        });

        fs.writeFile(file, JSON.stringify(updatedData), function (err) {
          if (err) {
            console.log('deleteById', err);
            return;
          }
          if (callback) {
            callback(updatedData);
          }
        })
        // Return updated data
        if (err) {
          console.log('deleteById', err);
          return;
        }
        if (callback && !err) {
          callback(updatedData);
          return;
        }
      });
    } else {
      console.log('deleteById', 'El fichero no existe');
      if (callback) {
        callback('El fichero no existe');
      }
    }
  } catch (err) {
    console.log('deleteById', `Error: ${err}`);
  }
}