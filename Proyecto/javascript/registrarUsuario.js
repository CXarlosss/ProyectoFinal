/* eslint-disable no-unused-vars */
// @ts-check
import { Usuario } from "../clases/class.js";
import { store } from "../store/redux.js";


document.addEventListener("DOMContentLoaded", () => {
  const formularioRegistro = /** @type {HTMLFormElement | null} */ (
    document.getElementById("usuario-form")
  );
  const formularioLogin = /** @type {HTMLFormElement | null} */ (
    document.getElementById("login-form")
  );
  const btnMostrarRegistro = /** @type {HTMLButtonElement | null} */ (
    document.getElementById("mostrar-registro")
  );
  const btnMostrarLogin = /** @type {HTMLButtonElement | null} */ (
    document.getElementById("mostrar-login")
  );
  const seccionRegistro = /** @type {HTMLElement | null} */ (
    document.getElementById("formulario-registro")
  );
  const seccionLogin = /** @type {HTMLElement | null} */ (
    document.getElementById("formulario-login")
  );
  if (!formularioRegistro || !formularioLogin || !btnMostrarRegistro || !btnMostrarLogin || !seccionRegistro || !seccionLogin) {
    console.error("Error al cargar elementos del DOM.");
    return;
  }
  // Alternar entre registro e inicio de sesión
  btnMostrarRegistro.addEventListener("click", () => {
    seccionRegistro.classList.remove("hidden");
    seccionLogin.classList.add("hidden");
  });
  btnMostrarLogin.addEventListener("click", () => {
    seccionRegistro.classList.add("hidden");
    seccionLogin.classList.remove("hidden");
  });
  // Evento para registrar usuario
  formularioRegistro.addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = /** @type {HTMLInputElement} */ (document.getElementById("nombre-usuario")).value.trim();
    const email = /** @type {HTMLInputElement} */ (document.getElementById("email-usuario")).value.trim();
    const telefono = /** @type {HTMLInputElement} */ (document.getElementById("telefono-usuario")).value.trim();
    const direccion = /** @type {HTMLInputElement} */ (document.getElementById("direccion-usuario")).value.trim();
    const password = /** @type {HTMLInputElement} */ (document.getElementById("password-usuario")).value.trim();

    if (!nombre || !email || !telefono || !direccion || !password) {
      alert("Todos los campos son obligatorios.");
      return;
    }
    // Comprobar si el usuario ya existe
    const usuariosGuardados = /** @type {Usuario[]} */ (JSON.parse(localStorage.getItem("usuarios") || "[]"));
    const usuarioExistente = usuariosGuardados.find(user => user.email === email);

    if (usuarioExistente) {
      alert("Este email ya está registrado. Inicia sesión.");
      return;
    }
    // Crear usuario
    const nuevoUsuario = new Usuario(Date.now(), nombre, email, password, telefono, direccion);
    usuariosGuardados.push(nuevoUsuario);
    // Guardar en localStorage
    localStorage.setItem("usuarios", JSON.stringify(usuariosGuardados));
    localStorage.setItem("usuarioRegistrado", JSON.stringify(nuevoUsuario));
    // Redirigir a la página de usuario
    window.location.href = "paginadelusuario.html";
  });
  
  // Evento para iniciar sesión
  formularioLogin.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = /** @type {HTMLInputElement} */ (document.getElementById("email-login")).value.trim();
    const password = /** @type {HTMLInputElement} */ (document.getElementById("password-login")).value.trim();

    const usuariosGuardados = /** @type {Usuario[]} */ (JSON.parse(localStorage.getItem("usuarios") || "[]"));
    const usuarioEncontrado = usuariosGuardados.find(user => user.email === email && user.password === password);

    if (usuarioEncontrado) {
      localStorage.setItem("usuarioRegistrado", JSON.stringify(usuarioEncontrado));
      window.location.href = "paginadelusuario.html";
    } else {
      alert("Email o contraseña incorrectos.");
    }
  });
});
