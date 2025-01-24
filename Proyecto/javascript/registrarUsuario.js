// Usuario.js
//@ts-check
document.addEventListener("DOMContentLoaded", () => {
  const btnUsuario = document.getElementById("btn-usuario");
  const formularioUsuario = document.getElementById("formulario-usuario");

  const seccionAgradecimientoUsuario = document.getElementById(
    "agradecimiento-usuario"
  );

  // Mostrar formulario de usuario
  btnUsuario?.addEventListener("click", () => {
    formularioUsuario?.classList.remove("hidden");
    seccionAgradecimientoUsuario?.classList.add("hidden");
  });

  // Evento para registrar usuario
  const formUsuario = document.getElementById("usuario-form");
  formUsuario?.addEventListener("submit", (e) =>
    registrarUsuario(e, formUsuario, seccionAgradecimientoUsuario)
  );
});

/**
 * @param {SubmitEvent} e
 * @param {HTMLElement} form
 * @param {HTMLElement | null} seccionAgradecimiento
 */
function registrarUsuario(e, form, seccionAgradecimiento) {
  e.preventDefault();

  if (!form || !seccionAgradecimiento) {
    console.error(
      "No se encontraron los elementos necesarios para registrar un usuario."
    );
    return;
  }

  try {
    // Simular progreso

    const seccionPromocion = document.getElementById("promocion-usuario");
    const nombreInput = document.getElementById("nombre-usuario");
    const emailInput = document.getElementById("email-usuario");
    const telefonoInput = document.getElementById("telefono-usuario");
    const direccionInput = document.getElementById("direccion-usuario");

    if (!nombreInput || !emailInput || !telefonoInput || !direccionInput) {
      console.error(
        "No se encontraron los elementos del formulario para registrar un usuario."
      );
      return;
    }

    const nombre = nombreInput;
    const email = emailInput;
    const telefono = telefonoInput;
    const direccion = direccionInput;

    if (!nombre || !email || !telefono || !direccion) {
      console.error("No se ingresaron los datos del usuario.");
      return;
    }

    const usuario = {
      id: Date.now(),
      nombre,
      email,
      telefono,
      direccion,
    };

    setTimeout(() => {
      seccionPromocion?.classList.add("hidden");
      form.classList.add("hidden");
      seccionAgradecimiento.classList.remove("hidden");
      seccionAgradecimiento.innerHTML = `
        <h3>¡Bienvenido!</h3>
        <p>Tu registro se completó con éxito. Estamos encantados de tenerte en nuestra comunidad.</p>
        <a href="servicios.html" class="btn">Explorar Servicios</a>
      `;
    }, 1500);
  } catch (error) {
    console.error("Error al registrar un usuario:", error);
  }
}
