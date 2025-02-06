import fs from 'fs';

export async function update(file, id, modifiedData, callback) {
  console.log('update', id, modifiedData);
  let updatedItem
  try {
    if (fs.existsSync(file)) {
      await fs.readFile(file, function (err, data) {
        const parsedData = JSON.parse(data.toString());
        // Filter by filterParams
        const updatedData = parsedData.map((item) => {
          if (item.id !== id) {
            return item
          } else {
            updatedItem = {
              ...item,
              ...modifiedData
            }
            return updatedItem
          }
        });

        fs.writeFile(file, JSON.stringify(updatedData), function (err) {
          if (err) {
            console.log('update', err);
            return err;
          }
          if (callback) {
            return callback(updatedItem);
          }
        })
        // Return updated data
        if (err) {
          console.log('update', err);
          return err;
        }
        // if (callback && !err) {
        //   return callback(updatedItem);
        // }
      });
    } else {
      // console.log('update', 'El fichero no existe');
      if (callback) {
        return callback('El fichero no existe');
      }
    }
  } catch (err) {
    console.log('update', `Error: ${err}`);
    return err;
  }
  return modifiedData;
}