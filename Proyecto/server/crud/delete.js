import fs from 'fs';

export async function deleteById(file, id, callback) {
  console.log('delete', id);
  let updatedData = [];
  try {
    if (fs.existsSync(file)) {
      await fs.readFile(file, function (err, data) {
        const parsedData = JSON.parse(data.toString());
        // Filter by filterParams
        updatedData = parsedData.filter((item) => {
          return item.id !== Number(id); // Convertir `id` a número antes de compararlo
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