// @ts-check
import { simpleFetch } from "../lib/simpleFetch.js";
import { HttpError } from "../clases/HttpError.js"; 


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

    /** @type {import("../clases/class.js").Usuario | null} */
    const usuario = usuarioRegistrado ? JSON.parse(usuarioRegistrado) : null;

    if (!usuario || typeof usuario !== "object" || !("id" in usuario)) {
        console.warn("⚠️ El usuario registrado en localStorage no es válido.");
        alert("No hay usuario registrado.");
        window.location.href = "registrar.html";
    }

    if (!usuario || !usuario.id) {
        alert("No hay usuario registrado.");
        window.location.href = "registrar.html";
    }

    /**
     * 📌 Mostrar modal y rellenar datos al hacer clic en "Editar"
     */
    btnEditarUsuario?.addEventListener("click", () => {
        if (!usuario) return;
        if (inputNombre) inputNombre.value = usuario.nombre;
        if (inputTelefono) inputTelefono.value = usuario.telefono;
        if (inputDireccion) inputDireccion.value = usuario.direccion;
        if (inputPassword) inputPassword.value = ""; // No mostrar la contraseña actual

        modalEditarUsuario?.classList.remove("hidden"); // Mostrar modal
    });

    /**
     * 📌 Función genérica para llamar a la API
     * @param {string} apiURL
     * @param {'GET' | 'POST' | 'PUT' | 'DELETE'} method
     * @param {object} [data]
     */
    async function getAPIData(apiURL = './server/BBDD/servicios.json', method = 'GET', data) {
      let apiData
    
      try {
        let headers = new Headers()
        headers.append('Content-Type', 'application/json')
        headers.append('Access-Control-Allow-Origin', '*')
        if (data) {
          headers.append('Content-Length', String(JSON.stringify(data).length))
        }
        apiData = await simpleFetch(apiURL, {
          // Si la petición tarda demasiado, la abortamos
          signal: AbortSignal.timeout(3000),
          method: method,
          body: data ?? undefined,
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

    /**
     * 📌 Guardar cambios al hacer submit en el formulario
     */
    formEditarUsuario?.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!usuario || !usuario.id) {
            console.error("❌ ERROR: El ID del usuario es inválido o no está definido.");
            alert("No se puede actualizar el usuario porque su ID no es válido.");
            return;
        }

        // 📌 Crear objeto con datos actualizados
        const datosActualizados = {
            nombre: inputNombre?.value.trim() || usuario.nombre,
            telefono: inputTelefono?.value.trim() || usuario.telefono,
            direccion: inputDireccion?.value.trim() || usuario.direccion,
            password: inputPassword?.value.trim() || usuario.password
        };

        console.log("📌 Enviando actualización para el usuario ID:", usuario.id);
        console.log("📩 Datos enviados al backend:", datosActualizados);

        try {
            const resultado = await getAPIData(`http://${location.hostname}:3001/update/users/${usuario.id}`, "PUT", datosActualizados);

            if (!resultado) {
                console.error("❌ No se pudo actualizar el usuario.");
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
});
