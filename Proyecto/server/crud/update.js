import fs from 'fs';

export async function update(file, id, modifiedData, callback) {
  try {
    if (fs.existsSync(file)) {
      await fs.readFile(file, function (err, data) {
        const parsedData = JSON.parse(data.toString());
        // Filter by filterParams
        const updatedData = parsedData.map((item) => {
          if (item.id !== id) {
            return item
          } else {
            return {
              ...item,
              ...modifiedData
            }
          }
        });

        fs.writeFile(file, JSON.stringify(updatedData), function (err) {
          if (err) {
            console.log('update', err);
            return;
          }
          if (callback) {
            callback(updatedData);
          }
        })
        // Return updated data
        if (err) {
          console.log('update', err);
          return;
        }
        if (callback && !err) {
          callback(updatedData);
          return;
        }
      });
    } else {
      console.log('update', 'El fichero no existe');
      if (callback) {
        callback('El fichero no existe');
      }
    }
  } catch (err) {
    console.log('update', `Error: ${err}`);
  }
}