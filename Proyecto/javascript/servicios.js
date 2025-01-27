//@ts-check

import { store } from "../store/redux.js";
import { Servicio } from "../clases/clase-servicio.js";

// Simulando un estado global como si fuera Redux
import serviciosJSON from "../api/factory.json"; // Importar el JSON con los datos iniciales

/** @type {{ servicios: Servicio[] }} */
const state = {
  servicios: [], 
};

console.log("Servicios iniciales cargados:", state.servicios);
//Cargar Servicios desde el json

/**
 * Función para renderizar los servicios en el contenedor.
 */
const renderServicios = () => {
  const serviciosContainer = document.getElementById("servicios-container");

  if (!serviciosContainer) {
    console.error("No se encontró el contenedor de servicios.");
    return;
  }

  serviciosContainer.innerHTML = state.servicios
    .map(
      (servicio) => `
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
};

/**
 * Función para manejar el registro de un nuevo servicio.
 * @param {SubmitEvent} e
 */
const registrarServicio = (e) => {
  e.preventDefault();

  const nombreInput = /** @type {HTMLInputElement} */ (document.getElementById("nombre-servicio"));
  const descripcionInput = /** @type {HTMLInputElement} */ (document.getElementById("descripcion-servicio"));
  const ubicacionInput = /** @type {HTMLInputElement} */ (document.getElementById("ubicacion-servicio"));
  const valoracionInput = /** @type {HTMLInputElement} */ (document.getElementById("valoracion-servicio"));
  const imagenInput = /** @type {HTMLInputElement} */ (document.getElementById("imagen-servicio"));

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

  const nuevoServicio = {
    id: Date.now(),
    nombre: nombreInput.value,
    descripcion: descripcionInput.value,
    ubicacion: ubicacionInput.value,
    valoracion: parseFloat(valoracionInput.value),
    imagen: imagenInput.value,
    precio: 0, // Asignar un valor por defecto o agregar un input para este campo
    horarios: "", // Asignar un valor por defecto o agregar un input para este campo
    metodoPago: "", // Asignar un valor por defecto o agregar un input para este campo
    categoria: "", // Asignar un valor por defecto o agregar un input para este campo
    etiquetas: [] // Asignar un valor por defecto o agregar un input para este campo
  };

  // Agregar el nuevo servicio al estado
  state.servicios.push(nuevoServicio);

  // Limpiar el formulario
  nombreInput.value = "";
  descripcionInput.value = "";
  ubicacionInput.value = "";
  valoracionInput.value = "";
  imagenInput.value = "";

  // Ocultar el modal
  document.getElementById("modal-crear-servicio")?.classList.add("hidden");

  // Renderizar los servicios actualizados
  renderServicios();
};

/**
 * Función para eliminar un servicio del estado.
 * @param {MouseEvent} e
 */
const eliminarServicio = (e) => {
  const target = e.target;
  if (target instanceof HTMLElement && target.classList.contains("btn-eliminar")) {
    const id = target.dataset.id;
    if (!id) return;

    state.servicios = state.servicios.filter(
      (servicio) => servicio.id !== parseInt(id, 10)
    );
    store.remoteService(id);
    renderServicios();
  }
};

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

  // Render inicial (por si hay datos precargados)
  renderServicios();
});
