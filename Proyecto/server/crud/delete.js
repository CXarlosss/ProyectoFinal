import fs from 'fs';

export async function deleteById(file, _id, callback) {
  console.log('delete', _id);
  let updatedData = [];
  try {
    if (fs.existsSync(file)) {
      await fs.readFile(file, function (err, data) {
        const parsedData = JSON.parse(data.toString());
        // Filter by filterParams
        updatedData = parsedData.filter((item) => {
          return item._id !== Number(_id); // Convertir `_id` a número antes de compararlo
        });
        

        fs.writeFile(file, JSON.stringify(updatedData), function (err) {
          if (err) {
            console.log('deleteById', err);
            return err;
          }
          if (callback) {
            return callback(updatedData);
          }
        })
        if (err) {
          console.log('deleteById', err);
          return err;
        }
        // if (callback && !err) {
        //   return callback(updatedData);
        // }
      });
    } else {
      console.log('deleteById', 'El fichero no existe');
      if (callback) {
        return callback('El fichero no existe');
      }
    }
  } catch (err) {
    console.log('deleteById', `Error: ${err}`);
    return err;
  }
}