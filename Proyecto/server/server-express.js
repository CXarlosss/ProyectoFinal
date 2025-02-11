// @ts-nocheck
import express from 'express';
import bodyParser from 'body-parser';
import { db } from "./server-mongodb.js";


const app = express();
const port =  process.env.PORT;



app.use(express.static('src'))
// for parsing application/json
app.use(bodyParser.json())
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/hello/:nombre', (req, res) => {
  res.send(`Hola ${req.params.nombre}`);
});
app.get('/check/:nombre', async (req, res) => {
  const usuarios = await db.users.count()
  res.send(`Hola ${req.params.nombre}, hay ${usuarios} usuarios`)
})

 // CRUD
app.post('/create/servicios', async (req, res) => {
  console.log("📌 Servicio recibido:", req.body);
  res.json(await db.Servicios.create(req.body))
}) 
app.get('/read/servicios',async (req, res) => {
  console.log("📌 Servicio Creado:", req.body);
  res.json(await db.Servicios.read(req.params.id, req.body))
});
app.put('/update/servicios/:_id', async(req, res) => {
  res.json(await db.Servicios.update(req.params.id, req.body))
  console.log(`📌 Recibiendo actualización para servicio _id: ${req.params._id}`, req.body);
  });
app.delete('/delete/servicios/:_id', async (req, res) => {
  console.log(`📌 Eliminando servicio con _id: ${req.params._id}`);
  res.json(await db.Servicios.delete(req.params.id))
});

app.post('/create/users', async (req, res) => {
  console.log("📌 Usuario recibido:", req.body);
  res.json(await db.Users.create(req.body))
}) 
app.get('/read/users',async (req, res) => {
  console.log("📌 Users Creado:", req.body);
  res.json(await db.Users.read(req.params.id, req.body))
});
app.put('/update/users/:_id', async(req, res) => {
  res.json(await db.Users.update(req.params.id, req.body))
  console.log(`📌 Recibiendo actualización para Usuario_id: ${req.params._id}`, req.body);
  });
  app.delete('/delete/users/:_id', async (req, res) => {
    console.log(`📌 Eliminando Users con _id: ${req.params._id}`);
    res.json(await db.users.delete(req.params.id))
  });

  app.listen(port, async () => {
    const servicios = await db.servicios.get();
    const users = await db.users.get();
    console.log(`Shopping List listening on port ${port}: ${servicios.length} servicios, ${users.length} users`);

})