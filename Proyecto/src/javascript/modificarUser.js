// @ts-check

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOM cargado correctamente.");
 const API_PORT = location.port ? `:${location.port}` : ''
  

  // 📌 Verificar si hay un usuario registrado en LocalStorage
  let usuarioRegistrado = localStorage.getItem("usuarioRegistrado");

  if (!usuarioRegistrado || usuarioRegistrado === "undefined") {
      console.warn("⚠️ No se encontró usuario registrado en localStorage.");
      alert("No hay usuario registrado.");
      window.location.href = "registrar.html"; // Redirigir a registro
      return;
  }

  /** @type {import("../clases/class.js").Usuario | null} */
  const usuario = usuarioRegistrado ? JSON.parse(usuarioRegistrado) : null;

  if (!usuario || typeof usuario !== "object" || !("_id" in usuario)) {
      console.warn("⚠️ El usuario registrado en localStorage no es válido.");
      alert("No hay usuario registrado.");
      window.location.href = "registrar.html";
      return;
  }

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
  const inputCorreo = /** @type {HTMLInputElement | null} */ (document.getElementById("editar-correo"));

  /**
   * 📌 Mostrar modal y rellenar datos al hacer clic en "Editar"
   */
  btnEditarUsuario?.addEventListener("click", () => {
      if (!usuario) return;
      if (modalEditarUsuario) {
        modalEditarUsuario.style.display = "block"; 
        }
      // Rellenar datos
      if (inputNombre) inputNombre.value = usuario.nombre;
      if (inputTelefono) inputTelefono.value = usuario.telefono;
      if (inputDireccion) inputDireccion.value = usuario.direccion;
      if (inputPassword) inputPassword.value = ""; 
      if (inputCorreo) {
          inputCorreo.value = usuario.email;
          inputCorreo.disabled = true; 
      }
  });
  console.log("📌 Enviando actualización para el usuario _id:", usuario._id);

  /**
   * 📌 Guardar cambios al hacer submit en el formulario
   */
formEditarUsuario?.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!usuario || !usuario._id) {
          console.error("❌ ERROR: El _id del usuario es inválido o no está definido.");
          alert("No se puede actualizar el usuario porque su _id no es válido.");
          return;
      }

      // 📌 Crear objeto con datos actualizados
      const datosActualizados = {
          nombre: inputNombre?.value.trim() || usuario.nombre,
          telefono: inputTelefono?.value.trim() || usuario.telefono,
          direccion: inputDireccion?.value.trim() || usuario.direccion,
          password: inputPassword?.value.trim() || usuario.password
      };

      console.log("📌 Enviando actualización para el usuario _id:", usuario._id);
      console.log("📩 Datos enviados al backend:", datosActualizados);

      try {
          //const resultado = await fetch(`${location.protocol}//${location.hostname}${API_PORT}/update/users/${usuario._id}`,
           const resultado = await fetch(`${location.protocol}//${location.hostname}${API_PORT}/api/update/users/${usuario._id}`, 
          {
              method: "PUT",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify(datosActualizados),
          }).then(response => {
              if (!response.ok) {
                  throw new Error(`Error en la actualización: ${response.statusText}`);
              }
              return response.json();
          }).catch(error => {
              console.error("🚨 Error al actualizar el usuario:", error);
              return null;
          });

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
          modalEditarUsuario?.classList.remove("hidden");

          alert("✅ Usuario actualizado correctamente.");
      } catch (error) {
          console.error("❌ Error al actualizar usuario:", error);
          alert("❌ No se pudo actualizar el usuario.");
      }
});

function cerrarModal() {
        if (modalEditarUsuario) {
            modalEditarUsuario.classList.remove("active");
            modalEditarUsuario.style.display = "none";
        }
}

btnCerrarModal?.addEventListener("click", cerrarModal);
});
