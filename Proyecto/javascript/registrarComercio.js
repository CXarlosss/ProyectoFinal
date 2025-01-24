// Comercio.js
//@ts-check
// Variables globales de Comercio
document.addEventListener('DOMContentLoaded', () => {
  const btnComercio = document.getElementById('btn-comercio');
  const formularioComercio = document.getElementById('formulario-comercio');
  const comercioInfo = document.getElementById('comercio-info');

  const seccionAgradecimiento = document.getElementById('agradecimiento');

  // Mostrar formulario de comercio
  btnComercio?.addEventListener('click', () => {
    formularioComercio?.classList.remove('hidden');
    comercioInfo?.classList.add('hidden');
    seccionAgradecimiento?.classList.add('hidden');
  });

  // Evento para registrar comercio
  const formComercio = document.getElementById('comercio-form');
  formComercio?.addEventListener('submit', (e) => registrarComercio(e, formComercio, comercioInfo, seccionAgradecimiento));
});

/**
 * @param {SubmitEvent} e
 * @param {HTMLElement} form
 * @param {HTMLElement | null} comercioInfo
 * @param {HTMLElement | null} seccionAgradecimiento
 */
function registrarComercio(e, form, comercioInfo, seccionAgradecimiento) {
  e.preventDefault();


const promocionUsuario = document.getElementById('promocion-usuario');
  const nombreInput = document.getElementById('nombre-comercio');
  const descripcionInput = document.getElementById('descripcion-comercio');
  const ubicacionInput = document.getElementById('ubicacion-comercio');

  if (!nombreInput || !descripcionInput || !ubicacionInput) {
    console.error('No se encontraron los elementos del formulario para registrar un comercio.');
    return;
  }

  const nombre = nombreInput;
  const descripcion = descripcionInput;
  const ubicacion = ubicacionInput;

  const comercio = {
    id: Date.now(),
    nombre,
    descripcion,
    ubicacion
  };

  setTimeout(() => {
    promocionUsuario?.classList.add('hidden');
    form.classList.add('hidden');
    if (seccionAgradecimiento) {
      seccionAgradecimiento.classList.remove('hidden');
      seccionAgradecimiento.innerHTML = `
        <h3>¡Bienvenido!</h3>
        <p>Estamos encantados de que te unas a nuestra comunidad. Comienza a explorar ahora.</p>
        <a href="servicios.html" class="btn">Explorar Servicios</a>
      `;
    }
  }, 1500);
}
