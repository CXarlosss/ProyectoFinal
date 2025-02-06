import fs from 'fs';

export async function filter(file, filterParams, callback) {
  let filteredData = []
  console.log('filter', filterParams);
  try {
    if (fs.existsSync(file)) {
      await fs.readFile(file, function (err, data) {
        const parsedData = JSON.parse(data.toString());
        // Filter by filterParams
        filteredData = parsedData.filter((item) => {
          return item.name.includes(filterParams.name)
        });
        if (filteredData.length === 0) {
          console.log('read', 'No se encontraron resultados');
          if (callback) {
            return callback('No se encontraron resultados');
          }
          return;
        }
        // Return filtered data
        if (err) {
          console.log('filter', err);
          return err;
        }
        // if (callback && !err) {
        //   return callback(filteredData);
        // }
      });
    } else {
      console.log('filter', 'El fichero no existe');
      if (callback) {
        return callback('El fichero no existe');
      }
    }
  } catch (err) {
    console.log('filter', `Error: ${err}`);
    return err;
  }
  return filteredData;
}