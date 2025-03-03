// @ts-check
import { animarEntrada, animarSalida } from "../javascript/animations/animaciones.js";

document.addEventListener("DOMContentLoaded", () => {
  // 📌 Elementos del DOM con tipado seguro
  const formularioRegistro = /** @type {HTMLElement | null} */ (document.getElementById("formulario-registro"));
  const formularioLogin = /** @type {HTMLElement | null} */ (document.getElementById("formulario-login"));
  const btnMostrarRegistro = /** @type {HTMLButtonElement | null} */ (document.getElementById("mostrar-registro"));
  const btnMostrarLogin = /** @type {HTMLButtonElement | null} */ (document.getElementById("mostrar-login"));

  // 📌 Verificación de elementos antes de ejecutar lógica
  if (!formularioRegistro || !formularioLogin || !btnMostrarRegistro || !btnMostrarLogin) {
    console.error("❌ Error al cargar elementos del DOM.");
    return;
  }

  // 🔹 Ocultar ambos formularios al inicio
  formularioRegistro.classList.add("hidden");
  formularioLogin.classList.add("hidden");

  /**
   * 📌 Alterna entre formularios con animaciones
   * @param {HTMLElement} mostrar - Formulario que aparecerá
   * @param {HTMLElement} ocultar - Formulario que desaparecerá
   */
  function alternarFormulario(mostrar, ocultar) {
    if (!mostrar.classList.contains("hidden")) return; // Previene doble clic innecesario

    animarSalida(ocultar, () => {
      ocultar.classList.add("hidden"); // Oculta después de la animación de salida

      // 🚀 IMPORTANTE: Forzar el render antes de iniciar la animación
      requestAnimationFrame(() => {
        mostrar.classList.remove("hidden");
        animarEntrada(mostrar);
      });
    });
  }

  // 📌 Eventos para alternar formularios con animación
  btnMostrarRegistro.addEventListener("click", () => alternarFormulario(formularioRegistro, formularioLogin));
  btnMostrarLogin.addEventListener("click", () => alternarFormulario(formularioLogin, formularioRegistro));
});
