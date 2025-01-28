//@ts-check

import { store } from "../store/redux.js";
import { Servicio as ServicioClass } from "../clases/clase-servicio.js";

/**
 * @type {{ servicios: Servicio[] }}
 */
const state = {
  servicios: []
};

// Cargar datos desde el archivo JSON
/**
 * @typedef {Object} Servicio
 * @property {number} id
 * @property {string} nombre
 * @property {string} descripcion
 * @property {number} precio
 * @property {number} valoracion
 * @property {string} ubicacion
 * @property {string} horarios
 * @property {string} metodoPago
 * @property {string} categoria
 * @property {string} imagen
 * @property {string[]} etiquetas
 */

/**
 * @param {Servicio[]} current
 * @param {Servicio[]} newData
 * @returns {Servicio[]}
 */
const mergeServicios = (current, newData) => {
  const ids = new Set(current.map(servicio => servicio.id));
  return [...current, ...newData.filter(servicio => !ids.has(servicio.id))];
};

fetch('./api/factory.json')
  .then(response => {
    if (!response.ok) {
      throw new Error(`Error al cargar JSON: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    state.servicios = mergeServicios(state.servicios, data.servicios);
    console.log("Servicios combinados sin duplicados:", state.servicios);
    renderServicios();
  })
  .catch(error => {
    console.error('Error al cargar los servicios:', error);
  });


/**
 * Inicializar eventos al cargar el DOM.
 */
document.addEventListener("DOMContentLoaded", () => {
  const btnCrearServicio = document.getElementById("btn-crear-servicio");
  const formCrearServicio = document.getElementById("crear-servicio-form");
  const serviciosContainer = document.getElementById("servicios-container");
  const btnCerrarModal = document.getElementById("btn-cerrar-modal");
  const modalCrearServicio = document.getElementById("modal-crear-servicio");

  if (!btnCrearServicio || !formCrearServicio || !serviciosContainer || !modalCrearServicio || !btnCerrarModal) {
    console.error("No se encontraron algunos elementos necesarios para la interacción.");
    return;
  }

  // Render inicial con los servicios del estado global
  renderServicios();

  // Mostrar el modal de creación
  btnCrearServicio.addEventListener("click", () => {
    modalCrearServicio.classList.remove("hidden");
  });

  // Cerrar el modal
  btnCerrarModal.addEventListener("click", () => {
    modalCrearServicio.classList.add("hidden");
  });

  // Manejar el envío del formulario de creación
  formCrearServicio.addEventListener("submit", registrarServicio);

  // Manejar la eliminación de servicios
  serviciosContainer.addEventListener("click", eliminarServicio);
});
const renderServicios = () => {
  const serviciosContainer = document.getElementById("servicios-container");

  if (!serviciosContainer) {
    console.error("No se encontró el contenedor de servicios.");
    return;
  }

  // Obtener los servicios del estado global
  const servicios = state.servicios;

  console.log("Renderizando servicios:", servicios);

  serviciosContainer.innerHTML = servicios
    .map(
      (/** @type {{ imagen: any; nombre: any; descripcion: any; ubicacion: any; valoracion: any; id: any; }} */ servicio) => `
        <div class="card">
          <img src="${servicio.imagen}" alt="Imagen de ${servicio.nombre}" class="card-img" />
          <h3>${servicio.nombre}</h3>
          <p>${servicio.descripcion}</p>
          <p><strong>Ubicación:</strong> ${servicio.ubicacion}</p>
          <p><strong>Valoración:</strong> ${servicio.valoracion}</p>
          <button class="btn-eliminar" data-id="${servicio.id}">Eliminar</button>
        </div>
      `
    )
    .join("");

  console.log("Servicios renderizados correctamente.");
};

/**
 * Función para manejar el registro de un nuevo servicio.
 * @param {SubmitEvent} e
 */
const registrarServicio = (e) => {
  e.preventDefault();

  const nombreInput = /** @type {HTMLInputElement} */ (
    document.getElementById("nombre-servicio")
  );
  const descripcionInput = /** @type {HTMLInputElement} */ (
    document.getElementById("descripcion-servicio")
  );
  const ubicacionInput = /** @type {HTMLInputElement} */ (
    document.getElementById("ubicacion-servicio")
  );
  const valoracionInput = /** @type {HTMLInputElement} */ (
    document.getElementById("valoracion-servicio")
  );
  const imagenInput = /** @type {HTMLInputElement} */ (
    document.getElementById("imagen-servicio")
  );

  if (
    !nombreInput ||
    !descripcionInput ||
    !ubicacionInput ||
    !valoracionInput ||
    !imagenInput
  ) {
    console.error("No se encontraron los elementos del formulario para registrar un servicio.");
    return;
  }

  const nuevoServicio = new ServicioClass(
    Date.now(),
    nombreInput.value,
    descripcionInput.value,
    0, // Precio por defecto
    parseFloat(valoracionInput.value),
    ubicacionInput.value,
    "", // Horarios por defecto
    "", // Método de pago por defecto
    "", // Categoría por defecto
    imagenInput.value,
    [] // Etiquetas por defecto
  );

  // Agregar el nuevo servicio al estado global
  store.addService(nuevoServicio);

  // Limpiar el formulario
  nombreInput.value = "";
  descripcionInput.value = "";
  ubicacionInput.value = "";
  valoracionInput.value = "";
  imagenInput.value = "";

  // Ocultar el modal (si existe)
  document.getElementById("modal-crear-servicio")?.classList.add("hidden");

  // Renderizar los servicios actualizados
  renderServicios();
};

/**
 * Función para eliminar un servicio del estado global.
 * @param {MouseEvent} e
 */
const eliminarServicio = (e) => {
  const target = e.target;
  if (target instanceof HTMLElement && target.classList.contains("btn-eliminar")) {
    const id = target.dataset.id;
    if (!id) return;

    // Eliminar el servicio del estado global
    store.removeService(id);

    // Renderizar los servicios actualizados
    renderServicios();
  }
};
