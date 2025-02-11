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

    // ✅ Verificar que el _id sea válido
    if (!ObjectId.isValid(id)) {
        console.error(`❌ ERROR: ID inválido para MongoDB: ${id}`);
        throw new Error("ID inválido para MongoDB");
    }

    const objectId = new ObjectId(id); // ✅ Convertir a ObjectId

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
    const result = await db.collection("Users").insertOne(user);
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