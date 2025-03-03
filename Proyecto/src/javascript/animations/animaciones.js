// @ts-check

/**
 * 📌 Función para animar la aparición de un formulario con efecto WOW.
 * @param {HTMLElement} formulario - Formulario a mostrar
 */
export function animarEntrada(formulario) {
    formulario.style.opacity = "0";
    formulario.style.transform = "scale(0.8) translateY(20px)";
  
    setTimeout(() => {
      formulario.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      formulario.style.opacity = "1";
      formulario.style.transform = "scale(1) translateY(0)";
    }, 10); // 🔥 Pequeño retraso para que la transición se active correctamente
  }
  
  /**
   * 📌 Función para animar la salida de un formulario con un efecto WOW.
   * @param {HTMLElement} formulario - Formulario a ocultar
   * @param {Function} callback - Función a ejecutar tras la animación
   */
  export function animarSalida(formulario, callback) {
    formulario.style.transition = "opacity 0.4s ease, transform 0.4s ease";
    formulario.style.opacity = "0";
    formulario.style.transform = "scale(0.8) translateY(-20px)";
  
    setTimeout(() => {
      formulario.style.transition = ""; // 🛑 Resetear transiciones
      callback();
    }, 400);
  }
  