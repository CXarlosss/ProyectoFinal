// @ts-nocheck
import express from 'express';
import bodyParser from 'body-parser';
import { db, connectDB } from "./server-mongodb.js";  // 👈 IMPORTA BIEN
import { ObjectId } from "mongodb"; 




const app = express();
const port =  process.env.PORT || 3001;



app.use(express.static('src'))
// for parsing application/json
app.use(bodyParser.json())
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))




 // SERVICIOS
 // 📌 Crear un nuevo servicio
app.post('/create/servicios', async (req, res) => {
  console.log("📌 Servicio recibido:", req.body);
  res.json(await db.servicios.create(req.body))
}) 
// 📌 Obtener todos los servicios
// 📌 Obtener un único servicio por su ID
app.get("/read/servicio/:id", async (req, res) => {
  try {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) {
          return res.status(400).json({ error: "ID inválido" });
      }

      const db = await connectDB();
      const servicio = await db.collection("Servicios").findOne({ _id: new ObjectId(id) });

      if (!servicio) {
          return res.status(404).json({ error: "Servicio no encontrado" });
      }
      
      res.json(servicio);
  } catch (error) {
      console.error("❌ Error al obtener el servicio:", error);
      res.status(500).json({ error: "Error interno del servidor" });
  }
});


// 📌 Actualizar un servicio
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
// 📌 Eliminar un servicio
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

//USUARIOS
// 📌 Crear un nuevo usuario
app.post('/create/users', async (req, res) => {
  console.log("📌 Usuario recibido:", req.body);
  res.json(await db.users.create(req.body))
}) 
// 📌 Obtener todos los usuarios
app.get('/read/users',async (req, res) => {
console.log("📌 Users Creado:", req.body);
  res.json(await db.users.get())
});
// 📌 Actualizar un usuario
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
// 📌 Eliminar un usuario
app.delete('/delete/users/:_id', async (req, res) => {
    console.log(`📌 Eliminando Users con _id: ${req.params._id}`);
    res.json(await db.users.delete(req.params.id))
});

//FAVORITOS

// 📌 Leer Cuantos hay
app.get('/users/:userId/favoritos', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "ID de usuario inválido" });
    }

    const db = await connectDB();
    const usuario = await db.collection("Users").findOne(
      { _id: new ObjectId(userId) },
      { projection: { favoritos: 1 } }
    );

    if (!usuario || !usuario.favoritos || usuario.favoritos.length === 0) {
      return res.json([]); // Si no tiene favoritos, devolvemos un array vacío
    }

    // 🚀 Aquí hacemos la consulta en la colección de Servicios para traer los datos completos
    const favoritosConNombres = await db.collection("Servicios").find({
      _id: { $in: usuario.favoritos.map(id => new ObjectId(id)) }
    }).toArray();

    res.json(favoritosConNombres);

  } catch (error) {
    console.error("❌ Error al obtener favoritos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});
// 📌 Añadir a favoritos
// 📌 Marcar como leídos los mensajes de un usuario en un chat
app.put('/mensajes/:servicioId/leidos', async (req, res) => {
  try {
      const { servicioId } = req.params;
      const usuarioGuardado = req.query.usuarioId; // Obtiene el usuario desde la query

      if (!ObjectId.isValid(servicioId) || !ObjectId.isValid(usuarioGuardado)) {
          return res.status(400).json({ error: "ID inválido" });
      }

      const db = await connectDB();

      const resultado = await db.collection("mensajes").updateMany(
          { servicioId: new ObjectId(servicioId), usuarioId: new ObjectId(usuarioGuardado), leido: false },
          { $set: { leido: true } }
      );

      console.log(`✅ ${resultado.modifiedCount} mensajes marcados como leídos en el chat con servicio ${servicioId}`);
      res.json({ message: "Mensajes marcados como leídos", resultado });

  } catch (error) {
      console.error("❌ Error al marcar mensajes como leídos:", error);
      res.status(500).json({ error: "Error interno del servidor" });
  }
});


// 📌 Quitar de favoritos
app.delete('/users/:userId/favoritos/:servicioId', async (req, res) => {
  try {
    const { userId, servicioId } = req.params;

    if (!ObjectId.isValid(userId) || !ObjectId.isValid(servicioId)) {
      return res.status(400).json({ error: "ID de usuario o servicio inválido" });
    }

    console.log(`📌 Eliminando favorito: usuario ${userId}, servicio ${servicioId}`);

    const database = await connectDB();
    const result = await database.collection("Users").updateOne(
      { _id: new ObjectId(userId) },
      { $pull: { favoritos: new ObjectId(servicioId) } }
    );

    if (result.modifiedCount === 0) {
      console.warn(`⚠ No se encontró el favorito para eliminar.`);
      return res.status(404).json({ error: "Favorito no encontrado" });
    }

    console.log(`✅ Favorito eliminado correctamente.`);
    res.json({ message: "Favorito eliminado correctamente" });

  } catch (error) {
    console.error("❌ Error al quitar de favoritos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});


//MENSAJES
// 📌 Crear un nuevo mensaje
app.post("/mensajes", async (req, res) => {
  try {
      console.log("📌 Recibiendo mensaje en el servidor...");
      console.log("Datos recibidos:", req.body);

      const { usuarioId, servicioId, contenido } = req.body;

      if (!usuarioId || !servicioId || !contenido) {
          return res.status(400).json({ error: "Datos incompletos para crear un mensaje" });
      }

      // 📌 Convertimos los IDs a ObjectId
      const mensajeData = {
          usuarioId: new ObjectId(usuarioId),
          servicioId: new ObjectId(servicioId),
          contenido,
          leido: false,
          fecha: new Date(),
      };

      // 📌 Guardar mensaje en la base de datos
      const database = await connectDB();
      const resultado = await database.collection("mensajes").insertOne(mensajeData);

      console.log("✅ Mensaje guardado en la base de datos:", resultado);
      res.json({ mensaje: "Mensaje guardado correctamente", resultado });

  } catch (error) {
      console.error("❌ Error en el servidor al guardar el mensaje:", error);
      res.status(500).json({ error: "Error interno del servidor" });
  }
});
// 📌 Obtener mensajes de un usuario o servicio
app.get('/mensajes', async (req, res) => {
  try {
    const { usuarioId, servicioId } = req.query;
    const filter = {};

    if (usuarioId && ObjectId.isValid(usuarioId)) {
      filter.usuarioId = new ObjectId(usuarioId);
    }

    if (servicioId && ObjectId.isValid(servicioId)) {
      filter.servicioId = new ObjectId(servicioId);
    }

    console.log("📌 Buscando mensajes con filtro:", filter);

    const database = await connectDB();

    const mensajes = await database.collection("mensajes").aggregate([
      { $match: filter },
      {
        $lookup: {
          from: "Users",
          localField: "usuarioId",
          foreignField: "_id",
          as: "usuario"
        }
      },
      {
        $lookup: {
          from: "Servicios",
          localField: "servicioId",
          foreignField: "_id",
          as: "servicio"
        }
      },
      { $unwind: { path: "$usuario", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$servicio", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          contenido: 1,
          fecha: 1,
          leido: 1,
          usuarioId: 1,
          servicioId: 1,
          "usuario.nombre": 1,
          "servicio.nombre": 1
        }
      }
    ]).toArray();

    console.log("✅ Mensajes encontrados:", mensajes);

    res.json(mensajes);
  } catch (error) {
    console.error("❌ Error al obtener mensajes:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});
// 📌 Marcar un mensaje como leído
app.put('/mensajes/:mensajeId', async (req, res) => {
  try {
    const { mensajeId } = req.params;

    if (!ObjectId.isValid(mensajeId)) {
      return res.status(400).json({ error: "ID de mensaje inválido" });
    }

    const resultado = await db.mensajes.update(new ObjectId(mensajeId));

    res.json({ message: "Mensaje marcado como leído", resultado });
  } catch (error) {
    console.error("❌ Error al actualizar mensaje:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});
// 📌 Eliminar un mensaje
app.delete('/mensajes/:mensajeId', async (req, res) => {
  try {
    const { mensajeId } = req.params;

    if (!ObjectId.isValid(mensajeId)) {
      return res.status(400).json({ error: "ID de mensaje inválido" });
    }

    const resultado = await db.mensajes.delete(new ObjectId(mensajeId));

    res.json({ message: "Mensaje eliminado correctamente", resultado });
  } catch (error) {
    console.error("❌ Error al eliminar mensaje:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});



  app.listen(port, async () => {
    const servicios = await db.servicios.get();
    const users = await db.users.get();
    console.log(`Shopping List listening on port ${port}: ${servicios.length} servicios, ${users.length} users`);

})