// @ts-nocheck


import express from 'express';
import bodyParser from 'body-parser';
import { db,connectDB,ObjectId } from "./server-mongodb.js";


const app = express();
const port =  process.env.PORT || 3001;



app.use(express.static('src'))
// for parsing application/json
app.use(bodyParser.json())
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))




app.use(express.static('src'))
// for parsing application/json
app.use(bodyParser.json())
// Habilitar CORS (por si se necesita acceso desde un frontend separado)
app.use((req, res, next) => {

    if (req.headers['x-forwarded-proto'] === 'https') {
      return res.redirect(`http://${req.headers.host}${req.url}`);
    }
  
  res.header("Access-Control-Allow-Origin", "*"); // Permite peticiones desde cualquier origen
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))



// 📌 Crear un nuevo servicio
 app.post('/create/servicios', async (req, res) => {
  try {
    const db = await connectDB();  // 💡 Asegura que tienes acceso a la DB
    const result = await db.collection("Servicios").insertOne(req.body);
    res.json(result);
  } catch (error) {
    console.error("❌ Error al crear el servicio:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});
// 📌 Obtener todos los servicios
app.get("/read/servicios", async (req, res) => {
  try {
    const db = await connectDB();
    const servicios = await db.collection("Servicios").find().toArray();

    // ✅ Enviar un array vacío en lugar de un error 404 si no hay servicios
    res.json(servicios);
  } catch (error) {
    console.error("❌ Error al obtener los servicios:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});
// 📌 Obtener un único servicio por su ID
// @ts-ignore
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
    const { _id } = req.params;
    console.log(`📌 Intentando eliminar servicio con _id: ${_id}`);

    if (!_id || !ObjectId.isValid(_id)) {
      console.error("❌ ERROR: ID inválido para MongoDB:", _id);
      return res.status(400).json({ error: "ID inválido para MongoDB" });
    }

    const db = await connectDB();
    const resultado = await db.collection("Servicios").deleteOne({ _id: new ObjectId(_id) });

    if (resultado.deletedCount === 0) {
      console.warn(`⚠ No se encontró el servicio para eliminar.`);
      return res.status(404).json({ error: "Servicio no encontrado" });
    }

    console.log(`✅ Servicio ${_id} eliminado correctamente.`);
    res.json({ message: "Servicio eliminado correctamente", resultado });

  } catch (error) {
    console.error("❌ Error en la eliminación:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});


//USUARIOS
// 📌 Crear un nuevo usuario
app.post('/create/users', async (req, res) => {
  const db = await connectDB();
  const result = await db.collection("Users").insertOne(req.body);
  res.json(result);
}) 
// 📌 Obtener todos los usuarios
app.get('/read/users', async (req, res) => {
  try {
    const db = await connectDB();
    const users = await db.collection("Users").find().toArray();
    res.json(users);
  } catch (error) {
    console.error("❌ Error al obtener los usuarios:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});
// 📌 Actualizar un usuario
app.put('/update/users/:_id', async (req, res) => {
  try {
    const { _id } = req.params;

    if (!ObjectId.isValid(_id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const db = await connectDB();
    const objectId = new ObjectId(_id);

    const usuarioExistente = await db.collection("Users").findOne({ _id: objectId });
    if (!usuarioExistente) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    if (req.body._id) delete req.body._id; // 🔥 Evitar problemas con _id

    const resultado = await db.collection("Users").updateOne(
      { _id: objectId },
      { $set: req.body }
    );

    if (!resultado.modifiedCount) {
      return res.status(404).json({ error: "Usuario no encontrado o sin cambios" });
    }

    res.json({ message: "Usuario actualizado correctamente" });
  } catch (error) {
    console.error("❌ Error en la actualización:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});
// 📌 Eliminar un usuario
app.delete('/delete/users/:_id', async (req, res) => {
  try {
    const { _id } = req.params;

    if (!ObjectId.isValid(_id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const db = await connectDB();
    const resultado = await db.collection("Users").deleteOne({ _id: new ObjectId(_id) });

    if (!resultado.deletedCount) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

//FAVORITOS

// 📌 Leer Cuantos hay
// 📌 Agregar o quitar un favorito
app.put('/users/:userId/favoritos/:servicioId', async (req, res) => {
  try {
    const { userId, servicioId } = req.params;

    if (!ObjectId.isValid(userId) || !ObjectId.isValid(servicioId)) {
      return res.status(400).json({ error: "ID de usuario o servicio inválido" });
    }

    const db = await connectDB();
    const usuario = await db.collection("Users").findOne({ _id: new ObjectId(userId) });

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const servicioObjectId = new ObjectId(servicioId);
    const yaEsFavorito = usuario.favoritos?.some(id => id.toString() === servicioObjectId.toString());

    if (yaEsFavorito) {
      await db.collection("Users").updateOne(
        { _id: new ObjectId(userId) },
        { $pull: { favoritos: servicioObjectId } }
      );
      return res.json({ message: "Favorito eliminado" });
    } else {
      await db.collection("Users").updateOne(
        { _id: new ObjectId(userId) },
        { $addToSet: { favoritos: servicioObjectId } }
      );
      return res.json({ message: "Favorito añadido" });
    }
  } catch (error) {
    console.error("❌ Error al actualizar favoritos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});
// 📌 Obtener la lista de favoritos de un usuario
app.get('/users/:userId/favoritos', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "ID de usuario inválido" });
    }

    console.log(`📌 Buscando favoritos para usuario: ${userId}`);

    const db = await connectDB();
    const usuario = await db.collection("Users").findOne(
      { _id: new ObjectId(userId) },
      { projection: { favoritos: 1 } }
    );

    if (!usuario || !usuario.favoritos || usuario.favoritos.length === 0) {
      console.warn("⚠ Usuario no tiene favoritos.");
      return res.json([]); // 🔹 Devuelve un array vacío en lugar de error 404
    }

    // 🚀 Consultamos la colección de Servicios con los IDs de favoritos
    const favoritosConDetalles = await db.collection("Servicios").find({
      _id: { $in: usuario.favoritos.map(id => new ObjectId(id)) }
    }).toArray();

    console.log(`✅ Favoritos encontrados para usuario ${userId}:`, favoritosConDetalles);

    res.json(favoritosConDetalles);
  } catch (error) {
    console.error("❌ Error al obtener favoritos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});
//FAVoritosMensajes

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

    const db = await connectDB();
    const usuario = await db.collection("Users").findOne({ _id: new ObjectId(userId) });

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const servicioObjectId = new ObjectId(servicioId);

    // 🚀 Verificar si el servicio está en favoritos antes de eliminarlo
    if (!usuario.favoritos || !usuario.favoritos.some(id => id.equals(servicioObjectId))) {
      console.warn(`⚠ El servicio ${servicioId} no está en favoritos.`);
      return res.status(404).json({ error: "Favorito no encontrado" });
    }

    const result = await db.collection("Users").updateOne(
      { _id: new ObjectId(userId) },
      { $pull: { favoritos: servicioObjectId } }
    );

    if (result.modifiedCount === 0) {
      console.warn(`⚠ No se encontró el favorito para eliminar.`);
      return res.status(404).json({ error: "Favorito no encontrado" });
    }

    console.log(`✅ Favorito ${servicioId} eliminado correctamente.`);
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

    const { usuarioId, servicioId, receptorId, contenido } = req.body;

    if (!usuarioId || !contenido) {
      return res.status(400).json({ error: "Datos incompletos para crear un mensaje" });
    }

    const db = await connectDB();

    let receptorFinal = receptorId ? new ObjectId(receptorId) : null;
    let servicioFinal = servicioId ? new ObjectId(servicioId) : null;

    if (servicioId) {
      const servicio = await db.collection("Servicios").findOne({ _id: servicioFinal });
      if (!servicio) {
        console.error("❌ Servicio no encontrado:", servicioId);
        return res.status(404).json({ error: "Servicio no encontrado" });
      }
      receptorFinal = servicio.usuarioId;
    } else if (receptorId) {
      const usuarioReceptor = await db.collection("Users").findOne({ _id: receptorFinal });
      if (!usuarioReceptor) {
        return res.status(404).json({ error: "Usuario receptor no encontrado" });
      }
    } else {
      return res.status(400).json({ error: "Debe haber un servicioId o un receptorId" });
    }
    const chatIdFinal = receptorFinal 
    ? [usuarioId.toString(), receptorFinal.toString()].sort().join("_") // ✅ Ordenado para asegurar siempre el mismo ID
    : `${usuarioId}_${servicioFinal}`;

    const mensajeData = {
        chatId: chatIdFinal,
        usuarioId: new ObjectId(usuarioId),
        servicioId: servicioFinal,
        receptorId: receptorFinal,
        contenido,
        leido: false,
        fecha: new Date(),
    };


    const resultado = await db.collection("mensajes").insertOne(mensajeData);
    console.log("✅ Mensaje guardado correctamente:", resultado);
    res.json({ mensaje: "Mensaje guardado correctamente", resultado });

  } catch (error) {
    console.error("❌ Error al guardar mensaje:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});
app.get("/read/mensajes", async (req, res) => {
  try {
    const db = await connectDB();
    const mensajes = await db.collection("mensajes").find().toArray();

    console.log("✅ Mensajes obtenidos:", mensajes); // <-- Aquí verifica si hay datos

    res.json(mensajes);
  } catch (error) {
    console.error("❌ Error al obtener los mensajes:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});
// 📌 Obtener mensajes de un usuario o servicio
app.get('/mensajes', async (req, res) => {
  try {
      const { usuarioId, contactoId, receptorId } = req.query;

      console.log("📌 Buscando mensajes con:", { usuarioId, contactoId, receptorId });

      const db = await connectDB();
      const query = {};

      // Validar IDs antes de convertirlos en ObjectId
      if (usuarioId && ObjectId.isValid(usuarioId)) {
          query.$or = [
              { usuarioId: new ObjectId(usuarioId) },
              { receptorId: new ObjectId(usuarioId) }
          ];
      } else {
          console.warn("⚠ usuarioId inválido:", usuarioId);
      }

      if (contactoId && ObjectId.isValid(contactoId)) {
          query.servicioId = new ObjectId(contactoId);
      } else {
          console.warn("⚠ contactoId inválido:", contactoId);
      }

      if (receptorId && ObjectId.isValid(receptorId)) {
          query.receptorId = new ObjectId(receptorId);
      } else {
          console.warn("⚠ receptorId inválido:", receptorId);
      }

      console.log("🔍 Query ejecutada en MongoDB:", query);

      const mensajes = await db.collection("mensajes")
          .find(query)
          .sort({ fecha: -1 })
          .toArray();

      console.log("✅ Mensajes encontrados:", mensajes);
      res.json(mensajes);

  } catch (error) {
      console.error("❌ Error al obtener mensajes:", error);
      res.status(500).json({ error: "Error interno del servidor" });
  }
});

// 📌 Marcar un mensaje como leído
app.put('/mensajes/:mensajeId',  async (req, res) => {
  try {
    const { mensajeId } = req.params;

    if (!ObjectId.isValid(mensajeId)) {
      return res.status(400).json({ error: "ID de mensaje inválido" });
    }

    const resultado = await db.collection("mensajes").updateOne(
      { _id: new ObjectId(mensajeId) },
      { $set: { leido: true } }
  );

    console.log("✅ Mensaje marcado como leído:", resultado);  

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

    const resultado = await db.collection("mensajes").deleteOne({ _id: new ObjectId(mensajeId) });


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