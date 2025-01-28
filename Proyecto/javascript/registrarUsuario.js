// @ts-check

import { Usuario } from "../clases/clase-usuario.js";
document.addEventListener("DOMContentLoaded", () => {
  const pantallaInicial = /** @type {HTMLElement | null} */ (document.getElementById("pantalla-inicial"));
  const formularioRegistro = /** @type {HTMLElement | null} */ (document.getElementById("formulario-registro"));
  const formularioLogin = /** @type {HTMLElement | null} */ (document.getElementById("formulario-login"));
  const listaUsuarios = /** @type {HTMLElement | null} */ (document.getElementById("lista-usuarios"));
  const usuariosContainer = /** @type {HTMLElement | null} */ (document.getElementById("usuarios-container"));

  const btnRegistrarse = /** @type {HTMLElement | null} */ (document.getElementById("btn-registrarse"));
  const btnIniciarSesion = /** @type {HTMLElement | null} */ (document.getElementById("btn-iniciar-sesion"));
  const usuarioForm = /** @type {HTMLFormElement | null} */ (document.getElementById("usuario-form"));
  const loginForm = /** @type {HTMLFormElement | null} */ (document.getElementById("login-form"));

  /** @type {Usuario[]} */
  const usuarios = [
    new Usuario(1, "Juan Pérez", "juan.perez@example.com", "123456", "611223344", "Calle Falsa 123"),
    new Usuario(2, "Ana García", "ana.garcia@example.com", "123456", "622334455", "Avenida Siempre Viva 742"),
    new Usuario(3, "Carlos López", "carlos.lopez@example.com", "123456", "633445566", "Boulevard Solitario 456"),
    new Usuario(4, "María Rodríguez", "maria.rodriguez@example.com", "123456", "644556677", "Plaza Mayor 23"),
    new Usuario(5, "Luis Martínez", "luis.martinez@example.com", "123456", "655667788", "Calle del Sol 45"),
  ];

  /** @type {Usuario | null} */
  let usuarioLogueado = null;

  // Eventos principales
  btnRegistrarse?.addEventListener("click", mostrarFormularioRegistro);
  btnIniciarSesion?.addEventListener("click", mostrarFormularioLogin);

  usuarioForm?.addEventListener("submit", registrarUsuario);
  loginForm?.addEventListener("submit", iniciarSesion);

  function mostrarFormularioRegistro() {
    pantallaInicial?.classList.add("hidden");
    formularioRegistro?.classList.remove("hidden");
  }

  function mostrarFormularioLogin() {
    pantallaInicial?.classList.add("hidden");
    formularioLogin?.classList.remove("hidden");
  }
  /**
   * @param {{ preventDefault: () => void; }} e
   */
  function registrarUsuario(e) {
    e.preventDefault();

    const nombre = /** @type {HTMLInputElement} */ (document.getElementById("nombre-usuario")).value.trim();
    const email = /** @type {HTMLInputElement} */ (document.getElementById("email-usuario")).value.trim();
    const telefono = /** @type {HTMLInputElement} */ (document.getElementById("telefono-usuario")).value.trim();
    const direccion = /** @type {HTMLInputElement} */ (document.getElementById("direccion-usuario")).value.trim();
    const password = /** @type {HTMLInputElement} */ (document.getElementById("password-usuario")).value.trim();

    const nuevoUsuario = new Usuario(Date.now(), nombre, email, password, telefono, direccion);
    usuarios.push(nuevoUsuario);

    formularioRegistro?.classList.add("hidden");
    usuarioLogueado = nuevoUsuario;
    mostrarUsuarios();
  }

  /**
   * @param {{ preventDefault: () => void; }} e
   */
  function iniciarSesion(e) {
    e.preventDefault();

    const nombre = /** @type {HTMLInputElement} */ (document.getElementById("nombre-login")).value.trim();
    const password = /** @type {HTMLInputElement} */ (document.getElementById("password-login")).value.trim();

    const usuarioEncontrado = usuarios.find((usuario) => usuario.nombre === nombre && usuario.password === password);

    if (usuarioEncontrado) {
      usuarioLogueado = usuarioEncontrado;
      formularioLogin?.classList.add("hidden");
      mostrarUsuarios();
    } else {
      alert("Nombre o contraseña incorrectos.");
    }
  }


  /**
   * Muestra los usuarios en un grid.
   */
  function mostrarUsuarios() {
    listaUsuarios?.classList.remove("hidden");
    const usuariosContainer = /** @type {HTMLElement | null} */ (document.getElementById("usuarios-container"));
    if (!usuariosContainer) return;

    usuariosContainer.innerHTML = usuarios
      .map(
        (usuario) => `
        <div class="usuario-card">
          <h4>${usuario.nombre}</h4>
          <p><strong>Email:</strong> ${usuario.email}</p>
          <p><strong>Teléfono:</strong> ${usuario.telefono}</p>
          <p><strong>Dirección:</strong> ${usuario.direccion}</p>
          <button class="btn-editar" data-id="${usuario.id}">Editar Perfil</button>
          <button class="btn-mensaje" data-id="${usuario.id}">Enviar Mensaje</button>
        </div>
      `
      )
      .join("");

    // Agregar eventos para editar y enviar mensajes
    /** @type {NodeListOf<HTMLButtonElement>} */
    const botonesEditar = usuariosContainer.querySelectorAll(".btn-editar");
    botonesEditar.forEach((btn) => btn.addEventListener("click", () => editarPerfil(btn.dataset.id || "")));

    /** @type {NodeListOf<HTMLButtonElement>} */
    const botonesMensaje = usuariosContainer.querySelectorAll(".btn-mensaje");
    botonesMensaje.forEach((btn) => btn.addEventListener("click", () => enviarMensaje(btn.dataset.id || "")));
}


  /**
   * Edita el perfil de un usuario.
   * @param {string} id
   */
  function editarPerfil(id) {
    const usuarioLogueado = usuarios.find((usuario) => String(usuario.id) === id);
    if (usuarioLogueado) {
      const nuevoNombre = prompt(`Editar nombre (${usuarioLogueado.nombre}):`, usuarioLogueado.nombre);
      if (nuevoNombre) usuarioLogueado.nombre = nuevoNombre;
      mostrarUsuarios();
    }
  }

  /**
   * Envía un mensaje a un usuario.
   * @param {string} id
   */
  function enviarMensaje(id) {
    const usuario = usuarios.find((usuario) => String(usuario.id) === id);
    if (usuario) {
      const mensaje = prompt(`Escribe un mensaje para ${usuario.nombre}:`);
      if (mensaje) alert(`Mensaje enviado a ${usuario.nombre}: ${mensaje}`);
    }
  }
  }
);
