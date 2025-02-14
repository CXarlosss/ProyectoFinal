//@ts-nocheck
import express, {Router} from 'express';
import bodyParser from 'body-parser';
import serverless from 'serverless-http';

import { MongoClient, ObjectId } from "mongodb";

//const uri = "mongodb+srv://carlosdepet:<db_password>@cluster0.qcz8s.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
//const uri = "mongodb+srv://carlosdepet:7k30jzQMPWxrW907"
// 🔹 Cargar variables de entorno
const URI = process.env.MONGO_ATLAS;
const api = express();
const router = Router();


const client = new MongoClient(URI);
const dbName = "LocalMarket";

async function connectDB() {
    // @ts-ignore
    if (!client.topology || !client.topology.isConnected()) {
        await client.connect();
        console.log("✅ Conectado a MongoDB correctamente");
    }
    return client.db(dbName);
}

// 📌 Exportamos `connectDB` y `db`
export { connectDB };


 // SERVICIOS
 // 📌 Crear un nuevo servicio
router.post('/create/servicios', async (req, res) => {

  res.json(await db.servicios.create(req.body))
}) 
// 📌 Obtener todos los servicios

// 📌 Obtener todos los servicios
router.get("/read/servicios", async (req, res) => {
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
router.get("/read/servicio/:id", async (req, res) => {
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
router.put('/update/servicios/:_id',requireAuth, async (req, res) => {
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
router.delete('/delete/servicios/:_id',requireAuth, async (req, res) => {
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
router.post('/create/users', async (req, res) => {
  console.log("📌 Usuario recibido:", req.body);
  res.json(await db.users.create(req.body))
}) 
// 📌 Obtener todos los usuarios
router.get('/read/users',async (req, res) => {
console.log("📌 Users Creado:", req.body);
  res.json(await db.users.get())
});
// 📌 Actualizar un usuario
router.put('/update/users/:_id', async (req, res) => {
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
router.delete('/delete/users/:_id', async (req, res) => {
    console.log(`📌 Eliminando Users con _id: ${req.params._id}`);
    res.json(await db.users.delete(req.params.id))
});

//FAVORITOS

// 📌 Leer Cuantos hay
router.put('/users/:userId/favoritos/:servicioId', async (req, res) => {
  try {
    const { userId, servicioId } = req.params;

    if (!ObjectId.isValid(userId) || !ObjectId.isValid(servicioId)) {
      return res.status(400).json({ error: "ID de usuario o servicio inválido" });
    }

    console.log(`📌 Actualizando favoritos para usuario ${userId}, servicio ${servicioId}`);

    const db = await connectDB();
    const usuario = await db.collection("Users").findOne({ _id: new ObjectId(userId) });

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const servicioObjectId = new ObjectId(servicioId);
    const yaEsFavorito = usuario.favoritos && usuario.favoritos.some(id => id.equals(servicioObjectId));

    if (yaEsFavorito) {
      // ❌ Si ya es favorito, lo quitamos
      await db.collection("Users").updateOne(
        { _id: new ObjectId(userId) },
        { $pull: { favoritos: servicioObjectId } }
      );
      console.log(`❌ Servicio ${servicioId} eliminado de favoritos`);
      return res.json({ message: "Favorito eliminado" });
    } else {
      // ✅ Si no es favorito, lo añadimos
      await db.collection("Users").updateOne(
        { _id: new ObjectId(userId) },
        { $addToSet: { favoritos: servicioObjectId } } // 💡 Evita duplicados
      );
      console.log(`✅ Servicio ${servicioId} añadido a favoritos`);
      return res.json({ message: "Favorito añadido" });
    }
  } catch (error) {
    console.error("❌ Error al actualizar favoritos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// 📌 Obtener la lista de favoritos de un usuario
router.get('/users/:userId/favoritos', async (req, res) => {
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
router.put('/mensajes/:servicioId/leidos', async (req, res) => {
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
router.delete('/users/:userId/favoritos/:servicioId', async (req, res) => {
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
router.post("/mensajes", async (req, res) => {
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
      // 🔍 Verificar si el servicio existe
      const servicio = await db.collection("Servicios").findOne({ _id: servicioFinal });

      if (!servicio) {
        console.error("❌ Servicio no encontrado:", servicioId);
        return res.status(404).json({ error: "Servicio no encontrado" });
      }

      receptorFinal = servicio.usuarioId; // El receptor es el dueño del servicio
    } else if (receptorId) {
      // 🔍 Verificar si el usuario receptor existe
      const usuarioReceptor = await db.collection("Users").findOne({ _id: receptorFinal });

      if (!usuarioReceptor) {
        console.error("⚠ Usuario receptor no encontrado. Asumimos que es un servicio.");
        receptorFinal = receptorId; // Deja el receptorId como string si no es un usuario
      }
    } else {
      return res.status(400).json({ error: "Debe haber un servicioId o un receptorId" });
    }

    // 🔥 Guardar mensaje en MongoDB
    const mensajeData = {
      usuarioId: new ObjectId(usuarioId),  // Convertir usuarioId a ObjectId
      servicioId: servicioFinal ? new ObjectId(servicioFinal) : null,
      receptorId: receptorFinal ? new ObjectId(receptorFinal) : null,
      contenido,
      leido: false,
      fecha: new Date(),
  };
  

    const resultado = await db.collection("mensajes").insertOne(mensajeData);

    console.log("✅ Mensaje guardado correctamente:", resultado);
    res.json({ mensaje: "Mensaje guardado correctamente", resultado });

  } catch (error) {
    console.error("❌ Error en el servidor al guardar el mensaje:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// 📌 Obtener mensajes de un usuario o servicio
router.get('/mensajes',requireAuth,  async (req, res) => {
  try {
      const { usuarioId } = req.query;
      const db = await connectDB();

      if (!ObjectId.isValid(usuarioId)) {
          return res.status(400).json({ error: "ID inválido" });
      }

      console.log("📌 Buscando mensajes con usuarioId:", usuarioId);

      const mensajes = await db.collection("mensajes").find({
        $or: [
            { usuarioId: new ObjectId(usuarioId) }, 
            { receptorId: new ObjectId(usuarioId) }, 
            { servicioId: new ObjectId(usuarioId) } 
        ]
    }).sort({ fecha: -1 }).toArray();
    
    
    
    

      console.log("✅ Mensajes encontrados:", mensajes);
      res.json(mensajes);
  } catch (error) {
      console.error("❌ Error al obtener mensajes:", error);
      res.status(500).json({ error: "Error interno del servidor" });
  }
});

// 📌 Marcar un mensaje como leído
router.put('/mensajes/:mensajeId', requireAuth, async (req, res) => {
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
router.delete('/mensajes/:mensajeId',requireAuth, async (req, res) => {
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

// for parsing application/json
api.use(bodyParser.json())
// for parsing application/x-www-form-urlencoded
api.use(bodyParser.urlencoded({ extended: true }))
api.use('/api/', router)
export const handler = serverless(api);



  
  function requireAuth(req, res, next) {
    // Simulation of authentication (OAuth2)
    if (req.headers.authorization === 'Bearer 123456') {
      next()
    } else {
      // Unauthorized
      res.status(401).send('Unauthorized')
    }
  }
export const db = {
    servicios: {
        get: getServicios,
        create: createServicios,
        update: updateServicios,
        delete: deleteServicios,
    },
    users: {
        get: getUsers,
        create: createUser,
        update: updateUser,
        delete: deleteUser,
        getFavoritos: getFavoritos,
        addFavorito: addFavorito,
        removeFavorito: removeFavorito

    },
    mensajes: {
        create: createMensaje,
        get: getMensajes,
        update: updateMensaje,
        delete: deleteMensaje
    }
};


/**
 * 📌 Obtener todos los servicios o filtrar por parámetros
 * @param {object} [filter={}] - Filtro opcional para la consulta.
 * @returns {Promise<Array<object>>} - Array de servicios encontrados.
 */
async function getServicios(filter = {}) {
    const db = await connectDB();
    return await db.collection("Servicios").find(filter).toArray();
}
/**
 * 📌 Crear un nuevo servicio
 * @param {object} servicio - Datos del servicio a insertar.
 * @returns {Promise<object>} - Servicio insertado con su _id.
 */
async function createServicios(servicio) {
    const db = await connectDB();

    // Elimina cualquier `_id` manual para que MongoDB lo genere automáticamente
    if (servicio._id) {
        delete servicio._id;
    }

    const result = await db.collection("Servicios").insertOne(servicio);
    console.log("✅ Servicio creado:", result.insertedId);
    return { ...servicio, _id: result.insertedId };
}
/**
 * 📌 Actualizar un servicio existente
 * @param {string} id - ID del servicio a actualizar.
 * @param {object} updates - Campos a actualizar.
 * @returns {Promise<object>} - Resultado de la actualización.
 */
async function updateServicios(id, updates) {
    const db = await connectDB();

    if (!ObjectId.isValid(id)) {
        console.error(`❌ ERROR: ID inválido para MongoDB: ${id}`);
        throw new Error("ID inválido para MongoDB");
    }

    const objectId = new ObjectId(id);

    if (updates._id) {
        delete updates._id; // 🔥 Asegurar que _id no se envía a MongoDB
    }

    console.log(`🔍 Actualizando servicio con ID: ${objectId}`);
    console.log("📝 Datos nuevos para actualización:", updates);

    const result = await db.collection("Servicios").updateOne(
        { _id: objectId },
        { $set: updates }
    );

    console.log(`✅ Servicio ${id} actualizado correctamente:`, result.modifiedCount);
    return result;
}
/**
 * 📌 Eliminar un servicio por ID
 * @param {string} id - ID del servicio a eliminar.
 * @returns {Promise<string>} - ID del servicio eliminado.
 */
async function deleteServicios(id) {
    const db = await connectDB();

    if (!ObjectId.isValid(id)) {
        console.error("❌ ERROR: ID inválido en la eliminación:", id);
        throw new Error("ID inválido para MongoDB");
    }

    console.log(`🗑 Eliminando servicio con _id: ${id}`);

    const result = await db.collection("Servicios").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
        console.warn("⚠ No se encontró el servicio para eliminar.");
        return id;
    }

    console.log("✅ Servicio eliminado:", result.deletedCount);
    return id;
}


/**
 * 📌 Obtener todos los usuarios o filtrar por parámetros
 * @param {object} [filter={}] - Filtro opcional para la consulta.
 * @returns {Promise<Array<object>>} - Array de usuarios encontrados.
 */
async function getUsers(filter = {}) {
    const db = await connectDB();
    return await db.collection("Users").find(filter).toArray();
}

/**
 * 📌 Crear un nuevo usuario
 * @param {object} user - Datos del usuario a insertar.
 * @returns {Promise<object>} - Usuario insertado con su _id.
 */
async function createUser(user) {
    const db = await connectDB();

    // 🚀 Insertar usuario en MongoDB (Mongo generará el _id automáticamente)
    const result = await db.collection("Users").insertOne({
        nombre: user.nombre,
        email: user.email,
        password: user.password,
        telefono: user.telefono,
        direccion: user.direccion
    });

    console.log("✅ Usuario creado en MongoDB con ID:", result.insertedId);
    return { ...user, _id: result.insertedId };  // Devolver el usuario con su nuevo _id
}

/**
 * 📌 Actualizar un usuario existente
 * @param {string} id - ID del usuario a actualizar.
 * @param {object} updates - Campos a actualizar.
 * @returns {Promise<object>} - Resultado de la actualización.
 */
async function updateUser(id, updates) {
    const db = await connectDB();
    const objectId = new ObjectId(id);  // Convertir el ID a ObjectId
    const result = await db.collection("Users").updateOne({ _id: objectId }, { $set: updates });

    console.log(`✅ Usuario actualizado: ${result.modifiedCount}`);
    return result;
}


/**
 * 📌 Eliminar un usuario por ID
 * @param {string} id - ID del usuario a eliminar.
 * @returns {Promise<string>} - ID del usuario eliminado.
 */
async function deleteUser(id) {
    const db = await connectDB();
    const result = await db.collection("users").deleteOne({ _id: new ObjectId(id) });
    console.log("✅ Usuario eliminado:", result.deletedCount);
    return id;
}

//Favoritos
/**
 * 📌 Obtener los favoritos de un usuario
 * @param {string} userId - ID del usuario
 * @returns {Promise<Array<string>>} - Lista de favoritos
 */
async function getFavoritos(userId) {
    const db = await connectDB();

    if (!ObjectId.isValid(userId)) {
        console.error("❌ ERROR: ID de usuario inválido:", userId);
        throw new Error("ID de usuario inválido");
    }

    const usuario = await db.collection("Users").findOne(
        { _id: new ObjectId(userId) },
        { projection: { favoritos: 1 } }
    );

    return usuario?.favoritos || [];
}

/**
 * 📌 Añadir un servicio a los favoritos del usuario
 * @param {string} userId - ID del usuario
 * @param {string} servicioId - ID del servicio
 */
async function addFavorito(userId, servicioId) {
    const db = await connectDB();

    if (!ObjectId.isValid(userId) || !ObjectId.isValid(servicioId)) {
        console.error("❌ ERROR: ID inválido en addFavorito:", userId, servicioId);
        throw new Error("ID inválido");
    }

    await db.collection("Users").updateOne(
        { _id: new ObjectId(userId) },
        { $addToSet: { favoritos: new ObjectId(servicioId) } }
    );
}

/**
 * 📌 Eliminar un servicio de los favoritos del usuario
 * @param {string} userId - ID del usuario
 * @param {string} servicioId - ID del servicio
 */
async function removeFavorito(userId, servicioId) {
    const db = await connectDB();

    if (!ObjectId.isValid(userId) || !ObjectId.isValid(servicioId)) {
        console.error("❌ ERROR: ID inválido en removeFavorito:", userId, servicioId);
        throw new Error("ID inválido");
    }

    await db.collection("Users").updateOne(
        { _id: new ObjectId(userId) },
        // @ts-ignore
        { $pull: { favoritos: new ObjectId(servicioId) } }
    );
}



//Mensajes
/**
 * 📌 Crear un nuevo mensaje
 * @param {string} usuarioId - ID del usuario que envía el mensaje
 * @param {string} servicioId - ID del servicio al que se envía el mensaje
 * @param {string} contenido - Contenido del mensaje
 * @returns {Promise<object>} - Mensaje insertado con su _id
 */

async function createMensaje(usuarioId, servicioId, contenido) {
    const db = await connectDB();

    if (!ObjectId.isValid(usuarioId) || !ObjectId.isValid(servicioId)) {
        console.error("❌ ERROR: ID inválido en createMensaje:", usuarioId, servicioId);
        throw new Error("ID inválido para MongoDB");
    }

    const mensaje = {
        chatId: `${usuarioId}_${servicioId}`, // 🔥 Aseguramos que usuario y servicio compartan chat
        usuarioId: new ObjectId(usuarioId),
        servicioId: new ObjectId(servicioId),
        contenido,
        fecha: new Date(),
        leido: false
    };

    const result = await db.collection("mensajes").insertOne(mensaje);
    console.log("✅ Mensaje creado en MongoDB:", result.insertedId);
    return { ...mensaje, _id: result.insertedId };
}
/**
 * 📌 Obtener mensajes de un usuario o servicio
 * 
 * @param {object} filter - Filtro opcional (usuarioId, servicioId)
 * @returns {Promise<Array<object>>} - Lista de mensajes
 */

async function getMensajes(filter = {}) {
    const db = await connectDB();
    
    const query = {};
    if (filter.usuarioId) {
        query.$or = [
            { usuarioId: new ObjectId(filter.usuarioId) },
            { servicioId: new ObjectId(filter.usuarioId) } // 🔥 Verifica si el usuario es un servicio
        ];
    }

    console.log("🔍 Query ejecutada en MongoDB:", query);

    return await db.collection("mensajes")
        .find(query)
        .sort({ fecha: 1 }) // 🔥 Ordenamos los mensajes por fecha
        .toArray();
}
/**
 * 📌 Marcar un mensaje como leído
 * @param {string} mensajeId - ID del mensaje a actualizar
 * @returns {Promise<object>} - Resultado de la actualización
 */
async function updateMensaje(mensajeId) {
    const db = await connectDB();

    if (!ObjectId.isValid(mensajeId)) {
        console.error("❌ ERROR: ID inválido en updateMensaje:", mensajeId);
        throw new Error("ID inválido");
    }

    const result = await db.collection("mensajes").updateOne(
        { _id: new ObjectId(mensajeId) },
        { $set: { leido: true } }
    );

    console.log(`✅ Mensaje ${mensajeId} actualizado:`, result.modifiedCount);
    return result;
}
/**
 * 📌 Eliminar un mensaje por ID
 * @param {string} mensajeId - ID del mensaje a eliminar
 * @returns {Promise<string>} - ID del mensaje eliminado
 */
async function deleteMensaje(mensajeId) {
    const db = await connectDB();

    if (!ObjectId.isValid(mensajeId)) {
        console.error("❌ ERROR: ID inválido en deleteMensaje:", mensajeId);
        throw new Error("ID inválido");
    }

    console.log(`🗑 Eliminando mensaje con _id: ${mensajeId}`);

    const result = await db.collection("mensajes").deleteOne({ _id: new ObjectId(mensajeId) });

    console.log("✅ Mensaje eliminado:", result.deletedCount);
    return mensajeId;
}
