import { MongoClient, ObjectId } from "mongodb";

// 📌 URI de conexión a MongoDB (Asegúrate de cambiarla si es necesario)
const URI = "mongodb://127.0.0.1:27017"; 
const client = new MongoClient(URI);
const dbName = "LocalMarket";

/**
 * 🔄 Conecta a la base de datos (se ejecuta solo una vez)
 */
async function connectDB() {
    // @ts-ignore
    if (!client.topology || !client.topology.isConnected()) {
        await client.connect();
        console.log("✅ Conectado a MongoDB correctamente");
    }
    return client.db(dbName);
}

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
    }
};

/**
 * 📌 Obtener todos los servicios o filtrar por parámetros
 * @param {object} [filter={}] - Filtro opcional para la consulta.
 * @returns {Promise<Array<object>>} - Array de servicios encontrados.
 */
async function getServicios(filter = {}) {
    const db = await connectDB();
    return await db.collection("servicios").find(filter).toArray();
}

/**
 * 📌 Crear un nuevo servicio
 * @param {object} servicio - Datos del servicio a insertar.
 * @returns {Promise<object>} - Servicio insertado con su `_id`.
 */
async function createServicios(servicio) {
    const db = await connectDB();
    const result = await db.collection("servicios").insertOne(servicio);
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
    const result = await db.collection("servicios").updateOne({ _id: new ObjectId(id) }, { $set: updates });
    console.log("✅ Servicio actualizado:", result.modifiedCount);
    return result;
}

/**
 * 📌 Eliminar un servicio por ID
 * @param {string} id - ID del servicio a eliminar.
 * @returns {Promise<string>} - ID del servicio eliminado.
 */
async function deleteServicios(id) {
    const db = await connectDB();
    const result = await db.collection("servicios").deleteOne({ _id: new ObjectId(id) });
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
    return await db.collection("users").find(filter).toArray();
}

/**
 * 📌 Crear un nuevo usuario
 * @param {object} user - Datos del usuario a insertar.
 * @returns {Promise<object>} - Usuario insertado con su `_id`.
 */
async function createUser(user) {
    const db = await connectDB();
    const result = await db.collection("users").insertOne(user);
    console.log("✅ Usuario creado:", result.insertedId);
    return { ...user, _id: result.insertedId };
}

/**
 * 📌 Actualizar un usuario existente
 * @param {string} id - ID del usuario a actualizar.
 * @param {object} updates - Campos a actualizar.
 * @returns {Promise<object>} - Resultado de la actualización.
 */
async function updateUser(id, updates) {
    const db = await connectDB();
    const result = await db.collection("users").updateOne({ _id: new ObjectId(id) }, { $set: updates });
    console.log("✅ Usuario actualizado:", result.modifiedCount);
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
