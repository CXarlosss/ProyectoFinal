
// @ts-check

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
  

//Manejo para registrar usuario
document.addEventListener("register-form-submit", (e) => {
  const evento = /** @type {CustomEvent} */ (e);
  const usuario = evento.detail; // ✅ Obtener los datos del usuario registrado

  if (!usuario) {
      alert("❌ No se pudo registrar el usuario.");
      return;
  }

  console.log("✅ Usuario registrado:", usuario);
  localStorage.setItem("usuarioRegistrado", JSON.stringify(usuario));
  window.location.href = "paginadelusuario.html";
});

document.addEventListener("login-form-submit", (e) => {
  const evento = /** @type {CustomEvent} */ (e);
  const usuario = evento.detail; // ✅ Obtener los datos del usuario autenticado

  if (!usuario) {
      alert("❌ Email o contraseña incorrectos.");
      return;
  }

  console.log("✅ Usuario autenticado:", usuario);
  localStorage.setItem("usuarioRegistrado", JSON.stringify(usuario));
  window.location.href = "paginadelusuario.html";
});

});