// @ts-check
// @ts-check
import { simpleFetch } from "../src/lib/simpleFetch.js";
import { HttpError } from "../src/classes/HttpError.js";


document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ DOM cargado correctamente.");
// 📌 Referencias a elementos del DOM
const btnEditarUsuario = /** @type {HTMLButtonElement | null} */ (document.querySelector(".btn-editar"));
const modalEditarUsuario = /** @type {HTMLDivElement | null} */ (document.getElementById("modal-editar-usuario"));
const formEditarUsuario = /** @type {HTMLFormElement | null} */ (document.getElementById("form-editar-usuario"));
const btnCerrarModal = /** @type {HTMLButtonElement | null} */ (document.getElementById("cerrar-modal"));

// 📌 Campos del formulario de edición
const inputNombre = /** @type {HTMLInputElement | null} */ (document.getElementById("editar-nombre"));
const inputTelefono = /** @type {HTMLInputElement | null} */ (document.getElementById("editar-telefono"));
const inputDireccion = /** @type {HTMLInputElement | null} */ (document.getElementById("editar-direccion"));
const inputPassword = /** @type {HTMLInputElement | null} */ (document.getElementById("editar-password"));

// 📌 Validar usuario en LocalStorage antes de parsear
let usuarioRegistrado = localStorage.getItem("usuarioRegistrado");

if (!usuarioRegistrado || usuarioRegistrado === "undefined") {
    console.warn("⚠️ No se encontró usuario registrado en localStorage.");
    alert("No hay usuario registrado.");
    window.location.href = "registrar.html"; // Redirigir a registro
}
/**
 * 📌 Mostrar modal y rellenar datos al hacer clic en "Editar"
 */
btnEditarUsuario?.addEventListener("click", () => {
    if (!usuario) return;
    if (inputNombre) inputNombre.value = usuario.nombre;
     // No modificable
    if (inputTelefono) inputTelefono.value = usuario.telefono;
    if (inputDireccion) inputDireccion.value = usuario.direccion;
    if (inputPassword) inputPassword.value = ""; // Dejar vacío para que el usuario no vea su contraseña actual

    modalEditarUsuario?.classList.remove("hidden"); // Mostrar modal
});

/**
 * @typedef {Object} Usuario
 * @property {number} id
 * @property {string} nombre
 * @property {string} email
 * @property {string} telefono
 * @property {string} direccion
 * @property {string} password
 */

/** @type {Usuario | null} */
const usuario = usuarioRegistrado ? JSON.parse(usuarioRegistrado) : null;

if (!usuario) {
    alert("No hay usuario registrado.");
    window.location.href = "registrar.html";
}

/**
 * @param {string | string[][] | Record<string, string> | URLSearchParams | undefined} data
 */
async function getAPIData(apiURL = 'api/users.json', method = 'GET', data) {
    let apiData

    console.log('getAPIData', method, data)
    try {
      let headers = new Headers()

      headers.append('Content-Type', !data ? 'application/json' : 'application/x-www-form-urlencoded')
      headers.append('Access-Control-Allow-Origin', '*')
      if (data) {
        headers.append('Content-Length', String(JSON.stringify(data).length))
      }
      apiData = await simpleFetch(apiURL, {
        // Si la petición tarda demasiado, la abortamos
        signal: AbortSignal.timeout(3000),
        method: method,
       
        body: data ? new URLSearchParams(data) : undefined,
        headers: headers
      });
    } catch (/** @type {any | HttpError} */err) {
      if (err.name === 'AbortError') {
        console.error('Fetch abortado');
      }
      if (err instanceof HttpError) {
        if (err.response.status === 404) {
          console.error('Not found');
        }
        if (err.response.status === 500) {
          console.error('Internal server error');
        }
      }
    }

    return apiData
  }
 
  formEditarUsuario?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!usuario) return;

    // 📌 Crear objeto con datos actualizados
    const datosActualizados = {
        nombre: inputNombre?.value.trim() || usuario.nombre,
        telefono: inputTelefono?.value.trim() || usuario.telefono,
        direccion: inputDireccion?.value.trim() || usuario.direccion,
        password: inputPassword?.value.trim() || usuario.password, // Mantener contraseña si no se cambia
    };

    try {
        // 📌 Enviar datos al backend con `PUT`
        const resultado = await getAPIData(`api/update.user.json?id=${usuario.id}`, "PUT", datosActualizados);

        if (!resultado) {
            alert("❌ No se pudo actualizar el usuario.");
            return;
        }

        console.log("✅ Usuario actualizado:", resultado);

        // 📌 Guardar cambios en LocalStorage
        const usuarioActualizado = { ...usuario, ...datosActualizados };
        localStorage.setItem("usuarioRegistrado", JSON.stringify(usuarioActualizado));

        // Ocultar modal
        modalEditarUsuario?.classList.add("hidden");

        alert("✅ Usuario actualizado correctamente.");
    } catch (error) {
        console.error("❌ Error al actualizar usuario:", error);
        alert("❌ No se pudo actualizar el usuario.");
    }
});
/**
 * 📌 Cerrar modal sin guardar cambios
 */
btnCerrarModal?.addEventListener("click", () => {
    modalEditarUsuario?.classList.add("hidden"); // Ocultar modal
});

/**
 * 📌 Función para leer usuarios de la API y actualizar el almacenamiento local
 * @param {undefined} [userId]
 * @param {string | Record<string, string> | URLSearchParams | string[][] | undefined} [datosActualizados]
 */
async function actualizarUsuario(userId, datosActualizados) {
    const apiData = await getAPIData(`http://${location.hostname}:3333/update/users/${userId}`, 'PUT', datosActualizados);
    console.log('after update on API', apiData);
    
    if (!apiData) {
        console.error("❌ Error: No se pudo obtener la lista de usuarios.");
        return null;
    }

    // 📌 Guardar en localStorage
    localStorage.setItem("usuarios", JSON.stringify(apiData));

    console.log("✅ Usuarios actualizados en localStorage:", apiData);
    return apiData;
}



/**
 * 📌 Guardar cambios al hacer submit en el formulario
 */
formEditarUsuario?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!usuario) return;

    // 📌 Crear objeto con datos actualizados
    const datosActualizados = {
        nombre: inputNombre?.value.trim() || usuario.nombre,
        telefono: inputTelefono?.value.trim() || usuario.telefono,
        direccion: inputDireccion?.value.trim() || usuario.direccion,
        password: inputPassword?.value.trim() || usuario.password, // Mantener contraseña si no se cambia
    };

    try {
        // 📌 Enviar datos al backend con PUT
        const resultado = await actualizarUsuario();

        console.log("✅ Usuario actualizado:", resultado);

        // 📌 Guardar cambios en LocalStorage
        const usuarioActualizado = { ...usuario, ...datosActualizados };
        localStorage.setItem("usuarioRegistrado", JSON.stringify(usuarioActualizado));

        // Ocultar modal
        modalEditarUsuario?.classList.add("hidden");

        alert("✅ Usuario actualizado correctamente.");
    } catch (error) {
        console.error("❌ Error al actualizar usuario:", error);
        alert("❌ No se pudo actualizar el usuario.");
    }
    });
});