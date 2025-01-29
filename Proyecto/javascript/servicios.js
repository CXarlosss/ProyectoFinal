// @ts-check

/* eslint-disable no-unused-vars */
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
 * @property {boolean} favorito
 */

/**
 * @type {{ servicios: Servicio[], favoritos: Servicio[] }}
 */
const state = {
  servicios: [],
  favoritos: []
};

/**
 * Carga los servicios desde un archivo JSON y actualiza el estado.
 */
const fetchServicios = () => {
  fetch("./api/factory.json")
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
        state.servicios = data.servicios.map(servicio => ({
          ...servicio,
          favorito: false
        }));

        renderServicios();
      }
    )
    .catch(error => {
      console.error("Error al cargar los servicios:", error);
    });
};

/**
 * Renderiza los servicios en el contenedor.
 */
const renderServicios = () => {
  const serviciosContainer = /** @type {HTMLElement | null} */ (
    document.getElementById("servicios-container")
  );

  if (!serviciosContainer) {
    console.error("No se encontró el contenedor de servicios.");
    return;
  }

  serviciosContainer.innerHTML = state.servicios
    .map(
      servicio => `
        <div class="card">
          <img src="${servicio.imagen}" alt="Imagen de ${servicio.nombre}" class="card-img" />
          <h3>${servicio.nombre}</h3>
          <p>${servicio.descripcion}</p>
          <p><strong>Ubicación:</strong> ${servicio.ubicacion}</p>
          <p><strong>Valoración:</strong> ${servicio.valoracion}</p>
          <button class="btn-favorito ${servicio.favorito ? "favorito" : ""}" data-id="${servicio.id}">
            ${servicio.favorito ? "★ Favorito" : "☆ Añadir a Favoritos"}
          </button>
          <button class="btn-mensaje" data-id="${servicio.id}">Enviar Mensaje</button>
        </div>
      `
    )
    .join("");

  console.log("Servicios renderizados correctamente.");
};

/**
 * Marca o desmarca un servicio como favorito.
 * @param {string} id - ID del servicio.
 */
const toggleFavorito = id => {
  const servicioSeleccionado = state.servicios.find(servicio => servicio.id === parseInt(id));

  if (!servicioSeleccionado) return;

  // Cambiar estado de favorito
  servicioSeleccionado.favorito = !servicioSeleccionado.favorito;

  // Actualizar la lista de favoritos en `state`
  if (servicioSeleccionado.favorito) {
    state.favoritos.push(servicioSeleccionado);
  } else {
    state.favoritos = state.favoritos.filter(fav => fav.id !== servicioSeleccionado.id);
  }

  console.log(`Favoritos actualizados:`, state.favoritos);
  renderServicios();
};

/**
 * Envía un mensaje a la persona del servicio.
 * @param {string} id - ID del servicio.
 */
const enviarMensaje = id => {
  const servicioSeleccionado = state.servicios.find(servicio => servicio.id === parseInt(id));

  if (!servicioSeleccionado) return;

  const mensaje = prompt(`Escribe un mensaje para ${servicioSeleccionado.nombre}:`);

  if (mensaje) {
    console.log(`Mensaje enviado a ${servicioSeleccionado.nombre}: ${mensaje}`);
    alert(`Mensaje enviado a ${servicioSeleccionado.nombre}: "${mensaje}"`);
  }
};

/** =======================
 * EVENTOS DOM
 * ======================= */
document.addEventListener("DOMContentLoaded", () => {
  console.log("Iniciando la aplicación...");
  fetchServicios();

  document.getElementById("servicios-container")?.addEventListener("click", e => {
    const target = /** @type {HTMLElement} */ (e.target);
    const id = target.dataset.id;

    if (!id) return;

    if (target.classList.contains("btn-favorito")) {
      toggleFavorito(id);
    } else if (target.classList.contains("btn-mensaje")) {
      enviarMensaje(id);
    }
  });
});
