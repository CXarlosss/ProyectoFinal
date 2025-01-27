//@ts-check

import { store } from "../store/redux.js";
import { Servicio } from "../clases/clase-servicio.js";

/**
 * /** @type {{ servicios: Servicio[] }} */
const state = {
  servicios: [
    // Ejemplo 1: Servicio de limpieza
    new Servicio(
      1,
      "Servicio de limpieza",
      "Limpieza profesional a domicilio.",
      30, // Precio
      4.5, // Valoración
      "Madrid", // Ubicación
      "8:00-20:00", // Horarios
      "Efectivo, Tarjeta", // Métodos de pago
      "Hogar", // Categoría
      "https://example.com/imagen1.jpg", // Imagen
      ["limpieza", "hogar"] // Etiquetas
    ),
    // Ejemplo 2: Reparación de electrodomésticos
    new Servicio(
      2,
      "Reparación de electrodomésticos",
      "Reparación rápida y eficaz.",
      50, // Precio
      4.8, // Valoración
      "Barcelona", // Ubicación
      "9:00-18:00", // Horarios
      "Tarjeta", // Métodos de pago
      "Reparaciones", // Categoría
      "https://example.com/imagen2.jpg", // Imagen
      ["reparación", "electrodomésticos"] // Etiquetas
    ),
    // Ejemplo 3: Clases de yoga
    new Servicio(
      3,
      "Clases de yoga",
      "Clases personalizadas para todos los niveles.",
      20, // Precio
      4.9, // Valoración
      "Valencia", // Ubicación
      "10:00-12:00", // Horarios
      "Efectivo, Transferencia", // Métodos de pago
      "Salud y Bienestar", // Categoría
      "https://example.com/imagen3.jpg", // Imagen
      ["yoga", "bienestar", "salud"] // Etiquetas
    )
  ]
};

console.log("Servicios iniciales cargados:", state.servicios);



const renderServicios = () => {
  const serviciosContainer = document.getElementById("servicios-container");

  if (!serviciosContainer) {
    console.error("No se encontró el contenedor de servicios.");
    return;
  }

  // Obtener los servicios del estado global
  const state = store.getState();
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

  const nuevoServicio = new Servicio(
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