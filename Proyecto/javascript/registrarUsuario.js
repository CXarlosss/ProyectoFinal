
// @ts-check

import { Usuario } from "../clases/class.js";
 import { store } from "../store/redux.js"; 
 import { simpleFetch } from '../src/lib/simpleFetch.js';
 import { HttpError } from '../src/classes/HttpError.js'




document.addEventListener("DOMContentLoaded", () => {

//Constantes uSER URL
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
  

async function getAPIData(apiURL = 'api/get.articles.json') {
  let apiData

  try {
    apiData = await simpleFetch(apiURL, {
      // Si la petición tarda demasiado, la abortamos
      signal: AbortSignal.timeout(3000),
      headers: {
        'Content-Type': 'application/json',
        // Add cross-origin header
        'Access-Control-Allow-Origin': '*',
      },
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
  // Evento para registrar usuario
  formularioRegistro.addEventListener("submit", async (e) => {
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
    
    // @ts-ignore
    const searchParams = new URLSearchParams(nuevoUsuario).toString()
    const apiData = await getAPIData(`http://${location.hostname}:1337/create/articles?${searchParams}`)


    
    usuariosGuardados.push(apiData);
    // Guardar en localStorage
    localStorage.setItem("usuarios", JSON.stringify(usuariosGuardados));
    localStorage.setItem("usuarioRegistrado", JSON.stringify(nuevoUsuario));
     store.user.login(nuevoUsuario);
     console.log("Usuario registrado:", nuevoUsuario);
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
})


