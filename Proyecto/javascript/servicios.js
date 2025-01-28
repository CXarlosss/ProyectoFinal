// @ts-check

import { store } from "../store/redux.js";
import { Servicio as ServicioClass } from "../clases/clase-servicio.js";

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
 * @type {{ servicios: Servicio[] }}
 */
const state = {
  servicios: []
};

/**
 * Combina dos listas de servicios eliminando duplicados por ID.
 * @param {Servicio[]} current - Lista actual de servicios.
 * @param {Servicio[]} newData - Nueva lista de servicios.
 * @returns {Servicio[]} - Lista combinada de servicios sin duplicados.
 */
const mergeServicios = (current, newData) => {
  const ids = new Set(current.map(servicio => servicio.id));
  return [...current, ...newData.filter(servicio => !ids.has(servicio.id))];
};

/**
 * Carga los servicios desde un archivo JSON y actualiza el estado.
 */
const fetchServicios = () => {
  fetch('./api/factory.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error al cargar JSON: ${response.status}`);
      }
      return response.json();
    })
    .then(
      /**
       * @param {{ servicios: Servicio[] }} data - Datos cargados del JSON.
       */
      data => {
        state.servicios = mergeServicios(state.servicios, data.servicios);
        console.log("Servicios combinados sin duplicados:", state.servicios);
        renderServicios();
      }
    )
    .catch(error => {
      console.error('Error al cargar los servicios:', error);
    });
};

/**
 * Renderiza los servicios en el contenedor, opcionalmente aplicando un filtro.
 * @param {string} filtro - Filtro a aplicar ("actividades" o "comercios").
 */
const renderServicios = (filtro = "") => {
  const serviciosContainer = /** @type {HTMLElement | null} */ (
    document.getElementById("servicios-container")
  );

  if (!serviciosContainer) {
    console.error("No se encontró el contenedor de servicios.");
    return;
  }

  let servicios = state.servicios;

  // Aplicar filtros según la categoría
  if (filtro === "actividades") {
    servicios = servicios.filter(servicio => servicio.categoria === "actividad");
  } else if (filtro === "comercios") {
    servicios = servicios.filter(servicio => servicio.categoria === "comercio");
  }

  serviciosContainer.innerHTML = servicios
    .map(
      servicio => `
        <div class="card">
          <img src="${servicio.imagen}" alt="Imagen de ${servicio.nombre}" class="card-img" />
          <h3>${servicio.nombre}</h3>
          <p>${servicio.descripcion}</p>
          <p><strong>Ubicación:</strong> ${servicio.ubicacion}</p>
          <p><strong>Valoración:</strong> ${servicio.valoracion}</p>
          ${
            servicio.categoria === "actividad"
              ? `<button class="btn-acceder" data-id="${servicio.id}">Acceder</button>`
              : `<button class="btn-eliminar" data-id="${servicio.id}">Eliminar</button>`
          }
        </div>
      `
    )
    .join("");

  console.log("Servicios renderizados correctamente.");
};

/**
 * Registra un nuevo servicio en el estado a partir del formulario.
 * @param {SubmitEvent} e - Evento del formulario.
 */
const registrarServicio = e => {
  e.preventDefault();

  const nombreInput = /** @type {HTMLInputElement | null} */ (
    document.getElementById("nombre-servicio")
  );
  const descripcionInput = /** @type {HTMLInputElement | null} */ (
    document.getElementById("descripcion-servicio")
  );
  const ubicacionInput = /** @type {HTMLInputElement | null} */ (
    document.getElementById("ubicacion-servicio")
  );
  const valoracionInput = /** @type {HTMLInputElement | null} */ (
    document.getElementById("valoracion-servicio")
  );
  const imagenInput = /** @type {HTMLInputElement | null} */ (
    document.getElementById("imagen-servicio")
  );
  const categoriaInput = /** @type {HTMLSelectElement | null} */ (
    document.getElementById("categoria-servicio")
  );

  if (
    !nombreInput ||
    !descripcionInput ||
    !ubicacionInput ||
    !valoracionInput ||
    !imagenInput ||
    !categoriaInput
  ) {
    console.error("Faltan elementos en el formulario.");
    return;
  }

  const nuevoServicio = {
    id: Date.now(),
    nombre: nombreInput.value,
    descripcion: descripcionInput.value,
    precio: 0, // Precio por defecto
    valoracion: parseFloat(valoracionInput.value),
    ubicacion: ubicacionInput.value,
    horarios: "", // Horarios por defecto
    metodoPago: "", // Método de pago por defecto
    categoria: categoriaInput.value,
    imagen: imagenInput.value,
    etiquetas: [] // Etiquetas por defecto
  };

  // Agregar al estado global y renderizar
  state.servicios.push(nuevoServicio);
  renderServicios();

  // Limpiar formulario y cerrar modal
  nombreInput.value = "";
  descripcionInput.value = "";
  ubicacionInput.value = "";
  valoracionInput.value = "";
  imagenInput.value = "";
  categoriaInput.value = "actividad";

  document.getElementById("modal-crear-servicio")?.classList.add("hidden");
};

/**
 * Elimina un servicio del estado por su ID.
 * @param {MouseEvent} e - Evento del clic.
 */
const eliminarServicio = e => {
  const target = /** @type {HTMLElement} */ (e.target);
  if (target.classList.contains("btn-eliminar")) {
    const id = target.dataset.id;
    if (!id) return;

    state.servicios = state.servicios.filter(servicio => servicio.id !== parseInt(id));
    renderServicios();
  }
};

/** =======================
 * EVENTOS DOM
 * ======================= */
document.addEventListener("DOMContentLoaded", () => {
  const btnCrearServicio = /** @type {HTMLElement | null} */ (
    document.getElementById("btn-crear-servicio")
  );
  const formCrearServicio = /** @type {HTMLFormElement | null} */ (
    document.getElementById("crear-servicio-form")
  );
  const btnCerrarModal = /** @type {HTMLElement | null} */ (
    document.getElementById("btn-cerrar-modal")
  );

  if (!btnCrearServicio || !formCrearServicio || !btnCerrarModal) {
    console.error("Elementos necesarios no encontrados.");
    return;
  }

  // Cargar servicios iniciales
  fetchServicios();

  // Eventos del formulario y botones
  btnCrearServicio.addEventListener("click", () => {
    document.getElementById("modal-crear-servicio")?.classList.remove("hidden");
  });

  btnCerrarModal.addEventListener("click", () => {
    document.getElementById("modal-crear-servicio")?.classList.add("hidden");
  });

  formCrearServicio.addEventListener("submit", registrarServicio);

  document.getElementById("btn-filtrar-actividades")?.addEventListener("click", () => renderServicios("actividades"));
  document.getElementById("btn-filtrar-comercios")?.addEventListener("click", () => renderServicios("comercios"));
  document.getElementById("btn-mostrar-todos")?.addEventListener("click", () => renderServicios());

  document.getElementById("servicios-container")?.addEventListener("click", e => {
    const target = /** @type {HTMLElement} */ (e.target);
    if (target.classList.contains("btn-acceder")) {
      const id = target.dataset.id;
      console.log(`Accediendo a la actividad con ID: ${id}`);
    } else if (target.classList.contains("btn-eliminar")) {
      eliminarServicio(e);
    }
  });
});
