// INFO: https://www.freecodecamp.org/espanol/news/como-crear-una-aplicacion-crud-de-linea-de-comandos-con-node-js/
import { create } from './crud/create.js';
import { read } from './crud/read.js';
import { update } from './crud/update.js';
import { deleteById } from './crud/delete.js';
import { filter } from './crud/filter.js';

const USERS_URL = './BBDD/users.json'
const SERVICIOS_URL = './BBDD/servicios.json'

// READ:
// read(USERS, (data) => console.log('server', data));
// read(ARTICLES, (data) => console.log('server', data));

// CREATE:
// create(USERS, { name: 'pepe', age: 12 }, (data) => console.log(`server ${data.name} creado`, data));

export const crud = {
  createU: (file = USERS_URL, data, callback) => create(file, data, callback),
  readU: (file = USERS_URL, callback) => read(file, callback),
  updateU: (file = USERS_URL, _id, data, callback) => update(file, _id, data, callback),
  deleteU: (file = USERS_URL, _id, callback) => deleteById(file, _id, callback),
  filterU: (file = USERS_URL, filterParams, callback) => filter(file, filterParams, callback),
  createS: (file = SERVICIOS_URL, data, callback) => create(file, data, callback),
  readS: (file = SERVICIOS_URL, callback) => read(file, callback),
  updateS: (file = SERVICIOS_URL, _id, data, callback) => update(file, _id, data, callback),
  deleteS: (file = SERVICIOS_URL, _id, callback) => deleteById(file, _id, callback),
  filterS: (file = SERVICIOS_URL, filterParams, callback) => filter(file, filterParams, callback),
};