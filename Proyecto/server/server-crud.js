// INFO: https://www.freecodecamp.org/espanol/news/como-crear-una-aplicacion-crud-de-linea-de-comandos-con-node-js/
import { read } from './crud/read.js';
import { create } from './crud/create.js';
import { filter } from './crud/filter.js';


const USERS_URL = './server/BBDD/users.json'
// const ARTICLES = './server/BBDD/articles.json'

// READ:
// read(USERS, (data) => console.log('server', data));
// read(ARTICLES, (data) => console.log('server', data));

// CREATE:
// create(USERS, { name: 'pepe', age: 12 }, (data) => console.log(`server ${data.name} creado`, data));

export const crud = {
  read: (file = USERS_URL, callback) => read(file, callback),
  create: (file = USERS_URL, data, callback) => create(file, data, callback),
  filter: (file = USERS_URL, filterParams, callback) => filter(file, filterParams, callback),
}