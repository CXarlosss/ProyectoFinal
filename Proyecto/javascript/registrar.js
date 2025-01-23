//@ts
// Importar las clases necesarias
import { ComercioActividad, Usuario } from '../clases/clases.js';

// Ejecutar el script cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
  // Referencias a elementos del DOM
  const btnComercio = /** @type {HTMLButtonElement | null} */ (document.getElementById('btn-comercio'));
  const btnUsuario = /** @type {HTMLButtonElement | null} */ (document.getElementById('btn-usuario'));
  const formularioComercio = /** @type {HTMLFormElement | null} */ (document.getElementById('formulario-comercio'));
  const formularioUsuario = /** @type {HTMLFormElement | null} */ (document.getElementById('formulario-usuario'));
  const seleccionInicial = /** @type {HTMLElement | null} */ (document.getElementById('seleccion-inicial'));
  const comercioInfo = /** @type {HTMLElement | null} */ (document.getElementById('comercio-info'));
  const usuarioInfo = /** @type {HTMLElement | null} */ (document.getElementById('usuario-info'));

  // Variables para almacenar instancias actuales
  /** @type {ComercioActividad | null} */
  let comercioActual = null;

  /** @type {Usuario | null} */
  let usuarioActual = null;

  // Eventos para los botones principales
  btnComercio?.addEventListener('click', () => mostrarFormulario(formularioComercio, seleccionInicial));
  btnUsuario?.addEventListener('click', () => mostrarFormulario(formularioUsuario, seleccionInicial));

  // Eventos para formularios
  const formComercio = /** @type {HTMLFormElement | null} */ (document.getElementById('comercio-form'));
  formComercio?.addEventListener('submit', (e) => registrarComercio(e, formComercio, comercioInfo));

  const formUsuario = /** @type {HTMLFormElement | null} */ (document.getElementById('usuario-form'));
  formUsuario?.addEventListener('submit', (e) => registrarUsuario(e, formUsuario, usuarioInfo));

  /**
   * Muestra un formulario ocultando la selección inicial
   * @param {HTMLElement | null} formulario
   * @param {HTMLElement | null} seleccion
   */
  function mostrarFormulario(formulario, seleccion) {
    if (seleccion) seleccion.classList.add('hidden');
    formulario?.classList.remove('hidden');
  }

  /**
   * Muestra la información del comercio registrado
   * @param {ComercioActividad} comercio
   * @param {HTMLElement | null} comercioInfo
   */
  function mostrarComercioInfo(comercio, comercioInfo) {
    if (!comercioInfo) return;
    comercioInfo.innerHTML = `
      <p>
        <strong>Comercio Registrado:</strong> ${comercio.nombre}
        <button id="editar-comercio">Editar Comercio</button>
      </p>
    `;
    const btnEditarComercio = /** @type {HTMLButtonElement | null} */ (document.getElementById('editar-comercio'));
    btnEditarComercio?.addEventListener('click', () => editarComercio(comercioInfo, formComercio));
  }

  /**
   * Muestra la información del usuario registrado
   * @param {Usuario} usuario
   * @param {HTMLElement | null} usuarioInfo
   */
  function mostrarUsuarioInfo(usuario, usuarioInfo) {
    if (!usuarioInfo) return;
    usuarioInfo.innerHTML = `
      <p>
        <strong>Usuario Registrado:</strong> ${usuario.nombre}
        <button id="editar-usuario">Editar Usuario</button>
      </p>
    `;
    const btnEditarUsuario = /** @type {HTMLButtonElement | null} */ (document.getElementById('editar-usuario'));
    btnEditarUsuario?.addEventListener('click', () => editarUsuario(usuario, formUsuario));
  }

  /**
   * Registra un nuevo comercio
   * @param {SubmitEvent} e
   * @param {HTMLFormElement} form
   * @param {HTMLElement | null} comercioInfo
   */
  function registrarComercio(e, form, comercioInfo) {
    e.preventDefault();

    const nombre = /** @type {HTMLInputElement | null} */ (document.getElementById('nombre-comercio'))?.value || '';
    const descripcion = /** @type {HTMLInputElement | null} */ (document.getElementById('descripcion-comercio'))?.value || '';
    const ubicacion = /** @type {HTMLInputElement | null} */ (document.getElementById('ubicacion-comercio'))?.value || '';
    const precio = parseFloat(/** @type {HTMLInputElement | null} */ (document.getElementById('precio-comercio'))?.value || '0');
    const valoracion = parseFloat(/** @type {HTMLInputElement | null} */ (document.getElementById('valoracion-comercio'))?.value || '0');
    const horarios = /** @type {HTMLInputElement | null} */ (document.getElementById('horarios-comercio'))?.value || '';
    const categoria = /** @type {HTMLInputElement | null} */ (document.getElementById('categoria-comercio'))?.value || '';
    const metodoPago = /** @type {HTMLInputElement | null} */ (document.getElementById('metodo-pago-comercio'))?.value || '';
    const imagen = /** @type {HTMLInputElement | null} */ (document.getElementById('imagen-comercio'))?.value || '';

    // Crear instancia del comercio
    comercioActual = new ComercioActividad(Date.now(), nombre, descripcion, precio, valoracion, ubicacion, horarios, metodoPago, categoria, imagen, []);

    // Ocultar formulario y mostrar información
    form.classList.add('hidden');
    mostrarComercioInfo(comercioActual, comercioInfo);
  }

  /**
   * Registra un nuevo usuario
   * @param {SubmitEvent} e
   * @param {HTMLFormElement} form
   * @param {HTMLElement | null} usuarioInfo
   */
  function registrarUsuario(e, form, usuarioInfo) {
    e.preventDefault();

    const nombre = /** @type {HTMLInputElement | null} */ (document.getElementById('nombre-usuario'))?.value || '';
    const email = /** @type {HTMLInputElement | null} */ (document.getElementById('email-usuario'))?.value || '';
    const telefono = /** @type {HTMLInputElement | null} */ (document.getElementById('telefono-usuario'))?.value || '';
    const direccion = /** @type {HTMLInputElement | null} */ (document.getElementById('direccion-usuario'))?.value || '';

    // Crear instancia del usuario
    usuarioActual = new Usuario(Date.now(), nombre, email, "Contraseña Segura", telefono, direccion, "cliente", []);

    // Ocultar formulario y mostrar información
    form.classList.add('hidden');
    mostrarUsuarioInfo(usuarioActual, usuarioInfo);
  }

  /**
   * Editar un comercio existente
   * @param {HTMLElement | null} comercioInfo
   * @param {HTMLFormElement | null} form
   */
  function editarComercio(comercioInfo, form) {
    if (!comercioActual || !form) return;

    /** @type {HTMLInputElement | null} */
    const nombreInput = document.getElementById('nombre-comercio');
    if (nombreInput) nombreInput.value = comercioActual.nombre;

    form.classList.remove('hidden');
  }
});
