import { Usuario } from "../clases/clase-usuario.js";

document.addEventListener("DOMContentLoaded", () => {
  const formUsuario = document.getElementById("usuario-form");
  const seccionAgradecimiento = document.getElementById("agradecimiento-usuario");
  const resumenUsuario = document.getElementById("resumen-usuario");

  formUsuario?.addEventListener("submit", (e) =>
    registrarUsuario(e, formUsuario, seccionAgradecimiento, resumenUsuario)
  );
});

/**
 * Registra al usuario y muestra un resumen de su información.
 * @param {SubmitEvent} e - Evento de envío del formulario.
 * @param {HTMLFormElement} form - Formulario de registro.
 * @param {HTMLElement | null} seccionAgradecimiento - Sección de agradecimiento.
 * @param {HTMLElement | null} resumenUsuario - Contenedor del resumen del usuario.
 */
function registrarUsuario(e, form, seccionAgradecimiento, resumenUsuario) {
  e.preventDefault();

  const nombreInput = document.getElementById("nombre-usuario");
  const emailInput = document.getElementById("email-usuario");
  const telefonoInput = document.getElementById("telefono-usuario");
  const direccionInput = document.getElementById("direccion-usuario");
  const passwordInput = document.getElementById("password-usuario");

  if (
    !nombreInput ||
    !emailInput ||
    !telefonoInput ||
    !direccionInput ||
    !passwordInput ||
    !seccionAgradecimiento ||
    !resumenUsuario
  ) {
    console.error("Faltan elementos en el formulario para registrar un usuario.");
    return;
  }

  // Crear instancia de usuario
  const nuevoUsuario = new Usuario(
    Date.now(),
    nombreInput.value,
    emailInput.value,
    passwordInput.value,
    telefonoInput.value,
    direccionInput.value
  );

  // Simular registro (puedes hacer un POST aquí)
  console.log("Usuario registrado:", nuevoUsuario);

  // Mostrar resumen del usuario
  resumenUsuario.innerHTML = `
    <p><strong>Nombre:</strong> ${nuevoUsuario.nombre}</p>
    <p><strong>Email:</strong> ${nuevoUsuario.email}</p>
    <p><strong>Teléfono:</strong> ${nuevoUsuario.telefono}</p>
    <p><strong>Dirección:</strong> ${nuevoUsuario.direccion}</p>
  `;

  // Eliminar el contenedor del formulario
  document.getElementById("formulario-usuario").remove();

  // Mostrar la sección de agradecimiento
  seccionAgradecimiento.classList.remove("hidden");
}
