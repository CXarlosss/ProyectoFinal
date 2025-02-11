
// @ts-check

import { Usuario } from "../clases/class.js";

 import { simpleFetch } from '../lib/simpleFetch.js';
 import { HttpError } from '../classes/HttpError.js'




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
  
/**
 * Get data from API
 * @param {string} apiURL
 * @param {string} method
 * @param {Object} [data]
}
 */
async function getAPIData(apiURL , method = 'GET', data) {
  let apiData

  // console.log('getAPIData', method, data)
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
      // @ts-expect-error TODO
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

formularioRegistro.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = /** @type {HTMLInputElement} */ (document.getElementById("nombre-usuario")).value.trim();
  const email = /** @type {HTMLInputElement} */ (document.getElementById("email-usuario")).value.trim();
  const telefono = /** @type {HTMLInputElement} */ (document.getElementById("telefono-usuario")).value.trim();
  const direccion = /** @type {HTMLInputElement} */ (document.getElementById("direccion-usuario")).value.trim();
  const password = /** @type {HTMLInputElement} */ (document.getElementById("password-usuario")).value.trim();

  if (!nombre || !email || !telefono || !direccion || !password) {
    alert("❌ Todos los campos son obligatorios.");
    return;
  }

  // 📌 Consultar usuarios en la API (asegurando que devuelve un array)
  const usuariosAPI = (await getAPIData(`http://${location.hostname}:3001/read/users`)) || [];
// Asegurar que usuariosAPI es un array antes de usar .find()
const usuarioExistente = Array.isArray(usuariosAPI) 
  ? usuariosAPI.find(user => user && typeof user === 'object' && "email" in user && user.email === email)
  : null;


  if (usuarioExistente) {
    alert("⚠️ Este email ya está registrado. Inicia sesión.");
    return;
  }

  // 📌 Crear usuario
  const nuevoUsuario = new Usuario(
    Date.now().toString(),
    nombre,
    email,
    password,
    telefono,
    direccion
  );
  const apiResponse = await getAPIData(`http://${location.hostname}:3001/create/users`, 'POST', nuevoUsuario);

  if (apiResponse) {
    console.log("✅ Usuario registrado:", apiResponse);
    localStorage.setItem("usuarioRegistrado", JSON.stringify(apiResponse));
    window.location.href = "paginadelusuario.html";
  } else {
    alert("❌ Error al registrar usuario.");
  }
});

 
  
  // 📌 Evento para iniciar sesión
  formularioLogin.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = /** @type {HTMLInputElement} */ (document.getElementById("email-login")).value.trim();
    const password = /** @type {HTMLInputElement} */ (document.getElementById("password-login")).value.trim();

    if (!email || !password) {
      alert("❌ Email y contraseña son obligatorios.");
      return;
    }

    // 📌 Consultar usuarios en la API
    const usuariosAPI = (await getAPIData(`http://${location.hostname}:3001/read/users`)) || [];

    // 📌 Buscar el usuario en la lista obtenida
    const usuarioEncontrado = Array.isArray(usuariosAPI) ? usuariosAPI.find(user => user.email === email && user.password === password) : null;

    if (usuarioEncontrado) {
      console.log("✅ Usuario autenticado:", usuarioEncontrado);
      localStorage.setItem("usuarioRegistrado", JSON.stringify(usuarioEncontrado));
      window.location.href = "paginadelusuario.html";
    } else {
      alert("⚠️ Email o contraseña incorrectos.");
    }
  });

});


