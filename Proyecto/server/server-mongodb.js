// @ts-ignore
import { MongoClient, ObjectId } from "mongodb";

// 📌 URI de conexión a MongoDB (Asegúrate de cambiarla si es necesario)
const URI = "mongodb://127.0.0.1:27017/"; 
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
export { connectDB, ObjectId };

/**
 * 🔄 Función para probar la conexión a MongoDB
 */
async function testMongoConnection() {
    try {
        console.log("🔄 Intentando conectar a MongoDB...");
        
        await client.connect();
        console.log("✅ Conectado a MongoDB correctamente");

        const db = client.db(dbName);
        console.log(`🔍 Bases de datos disponibles:`);
        const databases = await client.db().admin().listDatabases();
        console.table(databases.databases);

        // 📌 Verifica si la colección "servicios" existe
        const collections = await db.listCollections().toArray();
        const collectionNames = collections.map(col => col.name);
        console.log("📂 Colecciones en la base de datos:", collectionNames);

        // 📌 Prueba insertando un dato de prueba
        const testCollection = db.collection("test");
        const result = await testCollection.insertOne({ mensaje: "Prueba de conexión", fecha: new Date() });
        console.log("✅ Documento de prueba insertado con ID:", result.insertedId);

        // 📌 Elimina el documento de prueba
        await testCollection.deleteOne({ _id: result.insertedId });
        console.log("🗑️ Documento de prueba eliminado correctamente");

    } catch (error) {
        console.error("❌ Error conectando a MongoDB:", error);
    } 
}

// 📌 Ejecutar la prueba
testMongoConnection();
// 📌 Módulo de base de datos


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
  const objectId = new ObjectId(id);

  if (updates._id) delete updates._id; // 🔥 Evitar que _id sea modificado

  const result = await db.collection("Users").updateOne(
      { _id: objectId },
      { $set: updates }
  );

  return result;
}


/**
 * 📌 Eliminar un usuario por ID
 * @param {string} id - ID del usuario a eliminar.
 * @returns {Promise<string>} - ID del usuario eliminado.
 */
async function deleteUser(id) {
  const db = await connectDB();
  const result = await db.collection("Users").deleteOne({ _id: new ObjectId(id) });
  // @ts-ignore
  return result.deletedCount > 0 ? id : null;

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
        { receptorId: new ObjectId(filter.usuarioId) },
        { servicioId: new ObjectId(filter.usuarioId) }
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
