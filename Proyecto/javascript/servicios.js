//@ts-check
// Variables globales
import { Usuario } from '../clases/clase-usuario';
import { ComercioActividad } from '../clases/clase-comercio';
/**
 * 
 * @type {any[]}
 */
let allServicios = []; // Contiene todos los servicios cargados inicialmente
/**
 * @type {string | any[]}
 */
let filteredServicios = []; // Contiene los servicios mostrados actualmente
let currentIndex = 0; // Índice para controlar cuántos servicios se muestran
const ITEMS_PER_PAGE = 5; // Número de servicios a mostrar por página

document.addEventListener('DOMContentLoaded', () => {
  const serviciosContainer = document.getElementById('servicios-container');
  const btnFiltrarActividades = document.getElementById('btn-filtrar-actividades');
  const btnFiltrarComercios = document.getElementById('btn-filtrar-comercios');
  const btnMostrarTodos = document.getElementById('btn-mostrar-todos');

  // Cargar datos desde Api.json
  fetch('./api/factory.json')
    .then(response => response.ok ? response.json() : Promise.reject(new Error(`Error al cargar JSON: ${response.status}`)))
    .then(data => {
      allServicios = data; // Guardamos la lista completa
      filteredServicios = [...allServicios]; // Inicialmente, todos los servicios
      currentIndex = 0; // Reiniciar el índice
      mostrarServicios(filteredServicios.slice(0, ITEMS_PER_PAGE)); // Mostrar los primeros servicios
    })
    .catch(error => {
      console.error('Error al cargar los servicios:', error);
      if (serviciosContainer) {
        serviciosContainer.innerHTML = '<p>Hubo un error al cargar los servicios.</p>';
      }
    });

  // Listeners de los botones
  btnFiltrarActividades?.addEventListener('click', () => {
    filtrarServicios("Actividad");
  });

  btnFiltrarComercios?.addEventListener('click', () => {
    filtrarServicios("Comercio");
  });

  btnMostrarTodos?.addEventListener('click', () => {
    filtrarServicios(''); // Mostrar todos los servicios
  });
  
});

// Función para mostrar servicios
/**
 * Muestra los servicios en el contenedor #servicios-container
 * @param {Array<{imagen: string, nombre: string, descripcion: string, ubicacion: string, valoracion: string, id: string}>} servicios - La lista de servicios a mostrar
 */
function mostrarServicios(servicios) {
  const serviciosContainer = document.getElementById('servicios-container');
  if (!serviciosContainer) return;

  serviciosContainer.innerHTML = ''; // Limpiar el contenedor
  
  servicios.forEach(servicio => {
    const card = document.createElement('div');
    card.classList.add('card');

    card.innerHTML = `
      <img src="${servicio.imagen}" alt="${servicio.nombre}" class="card-img" />
      <h2 class="card-title">${servicio.nombre}</h2>
      <p class="card-desc">${servicio.descripcion}</p>
      <p class="card-location">Ubicación: ${servicio.ubicacion}</p>
      <p class="card-rating">${servicio.valoracion}</p>
      <a href="detalles.html?id=${servicio.id}" class="card-link">Más detalles</a>
    `;

    serviciosContainer.appendChild(card);
  });
}

// Filtra los servicios por categoría y reinicia la paginación
/**
 * @param {string} categoria
 */
// Filtra los servicios por categoría y reinicia la paginación
function filtrarServicios(categoria) {
  const serviciosContainer = document.getElementById('servicios-container');
  const mostrarMasButton = document.getElementById('btn-mostrar-mas');

  if (!serviciosContainer) {
    throw new Error('No se encontró el contenedor de servicios');
  }

  serviciosContainer.innerHTML = '';
  if (mostrarMasButton) {
    mostrarMasButton.style.display = 'block';
  }
  currentIndex = 0;

  // Usa la propiedad "categoria" en lugar de "categoria-comercio"
  filteredServicios = categoria
    ? allServicios.filter(s => s.categoria?.toLowerCase() === categoria.toLowerCase())
    : allServicios;

  mostrarServicios(filteredServicios.slice(0, ITEMS_PER_PAGE));

  if (filteredServicios.length <= ITEMS_PER_PAGE && mostrarMasButton) {
    mostrarMasButton.style.display = 'none';
  }
}
