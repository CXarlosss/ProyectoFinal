// @ts-nocheck
import express from 'express';
import bodyParser from 'body-parser';
import { db } from "./server-mongodb.js";
import { ObjectId } from "mongodb"; // Asegura que importas ObjectId

const app = express();
const port =  process.env.PORT || 3001;



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
  res.json(await db.servicios.create(req.body))
}) 
app.get('/read/servicios',async (req, res) => {
  console.log("📌 Servicio Creado:", req.body);
  res.json(await db.servicios.get())
});
app.put('/update/servicios/:_id', async (req, res) => {
  try {
    const { _id } = req.params;
    console.log(`📌 Recibiendo actualización para servicio _id: ${_id}`, req.body);

    if (!_id || !ObjectId.isValid(_id)) {
      console.error("❌ ERROR: ID inválido en la actualización:", _id);
      return res.status(400).json({ error: "ID inválido para MongoDB" });
    }

    // ✅ Convertir el _id a ObjectId
    const objectId = new ObjectId(_id);

    // ✅ Eliminar `_id` del cuerpo para evitar sobrescritura
    if (req.body._id) {
      delete req.body._id;
    }

    const resultado = await db.servicios.update(objectId, req.body);

    if (!resultado || resultado.modifiedCount === 0) {
      console.warn("⚠ No se encontró el servicio para actualizar o no hubo cambios.");
      return res.status(404).json({ error: "Servicio no encontrado o sin cambios." });
    }

    console.log(`✅ Servicio ${_id} actualizado correctamente.`);
    res.json({ message: "Servicio actualizado correctamente", resultado });

  } catch (error) {
    console.error("❌ Error en la actualización:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});
app.delete('/delete/servicios/:_id', async (req, res) => {
  try {
    console.log(`📌 Eliminando servicio con _id: ${req.params._id}`);

    if (!req.params._id || req.params._id.length !== 24) {
      console.error("❌ ERROR: ID inválido en la eliminación:", req.params._id);
      return res.status(400).json({ error: "ID inválido para MongoDB" });
    }

    const resultado = await db.servicios.delete(req.params._id);
    res.json(resultado);
  } catch (error) {
    console.error("❌ Error en la eliminación:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.post('/create/users', async (req, res) => {
  console.log("📌 Usuario recibido:", req.body);
  res.json(await db.users.create(req.body))
}) 
app.get('/read/users',async (req, res) => {
  console.log("📌 Users Creado:", req.body);
  res.json(await db.users.get())
});
app.put('/update/users/:_id', async (req, res) => {
  try {
    const { _id } = req.params;
    console.log(`📌 Recibiendo actualización para Usuario con ID: ${_id}`, req.body);

    if (!_id || !ObjectId.isValid(_id)) {
      console.error("❌ ERROR: ID inválido para MongoDB:", _id);
      return res.status(400).json({ error: "ID inválido para MongoDB" });
    }

    const objectId = new ObjectId(_id);

    if (req.body._id) delete req.body._id; // 🔥 Eliminar _id del body

    // 🔹 Verificar si el usuario existe antes de actualizarlo
    const usuarioExistente = await db.users.get({ _id: objectId });
    if (!usuarioExistente) {
      console.warn("⚠ Usuario no encontrado en la base de datos.");
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    // 🔹 Realizar la actualización en MongoDB
    const resultado = await db.users.update(objectId, req.body);

    if (!resultado || resultado.modifiedCount === 0) {
      console.warn("⚠ No se encontró el usuario para actualizar o no hubo cambios.");
      return res.status(404).json({ error: "Usuario no encontrado o sin cambios." });
    }

    console.log(`✅ Usuario ${_id} actualizado correctamente.`);
    res.json({ message: "Usuario actualizado correctamente", resultado });

  } catch (error) {
    console.error("❌ Error en la actualización:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
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