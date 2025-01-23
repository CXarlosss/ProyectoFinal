
//@ts-check
// Variables globales
/**
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
  const btnMostrarMas = document.getElementById('btn-mostrar-mas');
  const btnFiltrarActividades = document.getElementById('btn-filtrar-actividades');
  const btnFiltrarComercios = document.getElementById('btn-filtrar-comercios');
  const btnMostrarTodos = document.getElementById('btn-mostrar-todos');

  // 1. Cargar datos desde Api.json
  fetch('./javascript/factory.json')
  .then(res => res.json()).then(data => {
    allServicios = data; // Guardamos la lista completa en allServicios
    filteredServicios = [...allServicios]; // Inicialmente, filteredServicios contiene todos los servicios
    currentIndex = 0; // Reiniciamos el índice
    mostrarServicios(filteredServicios.slice(0, ITEMS_PER_PAGE)); // Mostramos los primeros 5 servicios
  }).catch(error => {
    console.error('Error al cargar los servicios:', error);
    if (serviciosContainer) {
      serviciosContainer.innerHTML = '<p>Hubo un error al cargar los servicios.</p>';
    }
  });
  fetch('./javascript/factory.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error al cargar JSON: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      allServicios = data; // Guardamos la lista completa en allServicios
      filteredServicios = [...allServicios]; // Inicialmente, filteredServicios contiene todos los servicios
      currentIndex = 0; // Reiniciamos el índice
      mostrarServicios(filteredServicios.slice(0, ITEMS_PER_PAGE)); // Mostramos los primeros 5 servicios
    })
    .catch(error => {
      console.error('Error al cargar los servicios:', error);
      if (serviciosContainer) {
        serviciosContainer.innerHTML = '<p>Hubo un error al cargar los servicios.</p>';
      }
    });


  // 2. Función para renderizar servicios en el contenedor

  /**
   * Muestra los servicios en el contenedor #servicios-container
   * @param {Array<{imagen: string, nombre: string, descripcion: string, ubicacion: string, valoracion: string, id: string}>} servicios - La lista de servicios a mostrar
   */
  function mostrarServicios(servicios) {
    servicios.forEach(servicio => {
      const card = document.createElement('div');
      card.classList.add('card');
  
      // Añadimos imagen, nombre, descripción, valoración, ubicación y enlace
      card.innerHTML = `
        <img src="${servicio.imagen}" alt="${servicio.nombre}" class="card-img" />
        <h2 class="card-title">${servicio.nombre}</h2>
        <p class="card-desc">${servicio.descripcion}</p>
        <p class="card-location">Ubicación: ${servicio.ubicacion}</p>
        <p class="card-rating"> ${servicio.valoracion}</p>
        <a href="detalles.html?id=${servicio.id}" class="card-link">Más detalles</a>
      `;
      serviciosContainer?.appendChild(card);
    });
  }
  // 4. Listeners de los botones para filtrar
  btnFiltrarActividades?.addEventListener('click', () => {
    filtrarServicios("Actividad");
  });

  btnFiltrarComercios?.addEventListener('click', () => {
    filtrarServicios("Comercio");
  });

  btnMostrarTodos?.addEventListener('click', () => {
    filtrarServicios("todos"); // Sin categoría, muestra todos los servicios
  });

  // 5. Función para filtrar servicios y reiniciar la paginación
  /**
   * @param {string} categoria
   */
  function filtrarServicios(categoria) {

    if (serviciosContainer) {
      serviciosContainer.innerHTML = ''; // Limpiar contenedor
    }
    if (btnMostrarMas) {
      btnMostrarMas.style.display = 'block'; // Mostrar el botón "Mostrar más"
    }
    currentIndex = 0; // Reiniciar el índice

    // Filtrar servicios si hay una categoría, de lo contrario usar todos
    filteredServicios = categoria ? allServicios.filter(s => s.categoria === categoria) : allServicios;
    mostrarServicios(filteredServicios.slice(0, ITEMS_PER_PAGE));

    // Ocultar el botón "Mostrar más" si no hay más servicios que mostrar
    if (filteredServicios.length <= ITEMS_PER_PAGE) {

      if (btnMostrarMas) {
        btnMostrarMas.style.display = 'none';
      }
     
    }
  }
});

