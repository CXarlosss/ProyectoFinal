//@ts-check
// Variables globales
import { Usuario } from '../clases/clase-usuario';
import { Comercio } from '../clases/clase-comercio';

let allServicios = [];
let filteredServicios = [];
const ITEMS_PER_PAGE = 10;

 
document.addEventListener('DOMContentLoaded', () => {
  const serviciosContainer = document.getElementById('servicios-container');
  const btnCrearServicio = document.getElementById('btn-crear-servicio');
  const modalCrearServicio = document.getElementById('modal-crear-servicio');
  const formCrearServicio = document.getElementById('crear-servicio-form');
  const btnCerrarModal = document.getElementById('btn-cerrar-modal');

  // Mostrar el modal al hacer clic en "Crear Servicio"
  btnCrearServicio?.addEventListener('click', () => {
    modalCrearServicio?.classList.remove('hidden');
  });

  // Cerrar el modal
  btnCerrarModal?.addEventListener('click', () => {
    modalCrearServicio?.classList.add('hidden');
  });

  // Manejar el envío del formulario de creación
  formCrearServicio?.addEventListener('submit', (e) => {
    e.preventDefault();

    // Obtener valores del formulario
    const nombre = document.getElementById('nombre-servicio')?.setAttribute("value","") || '';
    const descripcion = document.getElementById('descripcion-servicio')?.setAttribute("value","") || '';
    const ubicacion = document.getElementById('ubicacion-servicio')?.setAttribute("value","") || '';
    const valoracion = document.getElementById('valoracion-servicio')?.setAttribute("value","") || '';
    const imagen = document.getElementById('imagen-servicio')?.setAttribute("value","") || '';

    // Crear un nuevo servicio
    const nuevoServicio = {
      id: Date.now().toString(), // ID único basado en timestamp
      nombre,
      descripcion,
      ubicacion,
      valoracion,
      imagen,
    };

    // Añadir el nuevo servicio a la lista
    allServicios.push(nuevoServicio);
    filteredServicios = [...allServicios];

    // Actualizar la vista y cerrar el modal
    mostrarServicios(filteredServicios.slice(0, ITEMS_PER_PAGE));
    modalCrearServicio?.classList.add('hidden');
  });
});
document.addEventListener('DOMContentLoaded', () => {
  const serviciosContainer = document.getElementById('servicios-container');
  const btnCrearServicio = document.getElementById('btn-crear-servicio');
  const modalCrearServicio = document.getElementById('modal-crear-servicio');
  const formCrearServicio = document.getElementById('crear-servicio-form');
  const btnCerrarModal = document.getElementById('btn-cerrar-modal');

  // Mostrar el modal al hacer clic en "Crear Servicio"
  btnCrearServicio?.addEventListener('click', () => {
    modalCrearServicio?.classList.remove('hidden');
  });

  // Cerrar el modal
  btnCerrarModal?.addEventListener('click', () => {
    modalCrearServicio?.classList.add('hidden');
  });

  // Manejar el envío del formulario de creación
  formCrearServicio?.addEventListener('submit', (e) => {
    e.preventDefault();

    // Obtener valores del formulario
    const nombre = document.getElementById('nombre-servicio')?.setAttribute("value","") || '';
    const descripcion = document.getElementById('descripcion-servicio')?.setAttribute("value","") || '';
    const ubicacion = document.getElementById('ubicacion-servicio')?.setAttribute("value","") || '';
    const valoracion = document.getElementById('valoracion-servicio')?.setAttribute("value","") || '';
    const imagen = document.getElementById('imagen-servicio')?.setAttribute("value","") || '';

    // Crear un nuevo servicio
    const nuevoServicio = {
      id: Date.now().toString(), // ID único basado en timestamp
      nombre,
      descripcion,
      ubicacion,
      valoracion,
      imagen,
    };

    // Añadir el nuevo servicio a la lista
    allServicios.push(nuevoServicio);
    filteredServicios = [...allServicios];

    // Actualizar la vista y cerrar el modal
    mostrarServicios(filteredServicios.slice(0, ITEMS_PER_PAGE));
    modalCrearServicio?.classList.add('hidden');
  });
});
/**
 * @param {any[]} servicios
 */
function mostrarServicios(servicios) {
  const serviciosContainer = document.getElementById('servicios-container');
  if (serviciosContainer) {
    serviciosContainer.innerHTML = '';
  }

  servicios.forEach(servicio => {
    const servicioElement = document.createElement('div');
    servicioElement.classList.add('servicio');

    servicioElement.innerHTML = `
      <h3>${servicio.nombre}</h3>
      <p>${servicio.descripcion}</p>
      <p>Ubicación: ${servicio.ubicacion}</p>
      <p>Valoración: ${servicio.valoracion}</p>
      <img src="${servicio.imagen}" alt="${servicio.nombre}">
    `;

    serviciosContainer?.appendChild(servicioElement);
  });
/**
 * @typedef {Object} Servicio
 * @property {string} id
 * @property {string} nombre
 * @property {string} descripcion
 * @property {string} ubicacion
 * @property {string} valoracion
 * @property {string} imagen
 */

/**
 * @param {Servicio[]} servicios
 */
function renderServicios(servicios) {
  const serviciosContainer = document.getElementById('servicios-container');
  if (serviciosContainer) {
    serviciosContainer.innerHTML = '';
  }

  servicios.forEach(servicio => {
    const servicioElement = document.createElement('div');
    servicioElement.classList.add('servicio');

    servicioElement.innerHTML = `
      <h3>${servicio.nombre}</h3>
      <p>${servicio.descripcion}</p>
      <p>Ubicaci n: ${servicio.ubicacion}</p>
      <p>Valoraci n: ${servicio.valoracion}</p>
      <img src="${servicio.imagen}" alt="${servicio.nombre}">
    `;

    serviciosContainer?.appendChild(servicioElement);
  });
}
}