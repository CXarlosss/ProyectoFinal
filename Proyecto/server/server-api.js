// server.api.js
import * as http from "node:http";
import { crud } from "./server-crud.js";

const MIME_TYPES = {
  default: "application/octet-stream",
  html: "text/html; charset=UTF-8",
  js: "application/javascript",
  json: "application/json",
  css: "text/css",
  png: "image/png",
  jpg: "image/jpg",
  gif: "image/gif",
  ico: "image/x-icon",
  svg: "image/svg+xml",
};

// const USERS_URL = './server/BBDD/users.json'
const USERS_URL = './server/BBDD/users.json'

http
  .createServer(async (request, response) => {
    const url = new URL(`http://${request.headers.host}${request.url}`);
    const urlParams = Object.fromEntries(url.searchParams)
    const statusCode = 200
    let responseData = []
    console.log(url.pathname, url.searchParams);
    // Set Up CORS
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Content-Type', MIME_TYPES.json);
    response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    response.setHeader("Access-Control-Allow-Headers", "*");
    response.setHeader('Access-Control-Max-Age', 2592000); // 30 days
    response.writeHead(statusCode);

    if (request.method === 'OPTIONS') {
      response.end();
      return;
    } 

    switch (url.pathname) {
      case '/create/articles':
        crud.create(USERS_URL, urlParams, (data) => {
          console.log(`server ${data.name} creado`, data)
          responseData = data

          response.write(JSON.stringify(responseData));
          response.end();
        });
        break;
      case '/read/articles':
        crud.read(USERS_URL, (data) => {
          console.log('server read articles', data)
          responseData = data

          response.write(JSON.stringify(responseData));
          response.end();
        });
        break;
      case '/filter/articles':
        crud.filter(USERS_URL, urlParams, (data) => {
          console.log('server filter articles', data)
          responseData = data

          response.write(JSON.stringify(responseData));
          response.end();
        })
        break;
      default:
        console.log('no se encontro el endpoint');

        response.write(JSON.stringify('no se encontro el endpoint'));
        response.end();
        break;
    }
  })
  // @ts-ignore
  .listen(process.env.API_PORT, process.env.IP);

  console.log('Server running at http://' + process.env.IP + ':' + process.env.API_PORT + '/');