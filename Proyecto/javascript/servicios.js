// Variables globales
let allServicios = []; // Contiene todos los servicios cargados inicialmente
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
      serviciosContainer.innerHTML = '<p>Hubo un error al cargar los servicios.</p>';
    });

  // 2. Función para renderizar servicios en el contenedor
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
  
      serviciosContainer.appendChild(card);
    });
  }

  // 3. Listener para el botón "Mostrar más"
  btnMostrarMas.addEventListener('click', () => {
    const nextItems = filteredServicios.slice(currentIndex, currentIndex + ITEMS_PER_PAGE);
    mostrarServicios(nextItems); // Mostrar los siguientes servicios
    currentIndex += ITEMS_PER_PAGE; // Actualizar el índice

    // Ocultar el botón si ya no hay más servicios
    if (currentIndex >= filteredServicios.length) {
      btnMostrarMas.style.display = 'none';
    }
  });

  // 4. Listeners de los botones para filtrar
  btnFiltrarActividades.addEventListener('click', () => {
    filtrarServicios("Actividad");
  });

  btnFiltrarComercios.addEventListener('click', () => {
    filtrarServicios("Comercio");
  });

  btnMostrarTodos.addEventListener('click', () => {
    filtrarServicios(); // Sin categoría, muestra todos los servicios
  });

  // 5. Función para filtrar servicios y reiniciar la paginación
  function filtrarServicios(categoria) {
    serviciosContainer.innerHTML = ''; // Limpiar contenedor
    btnMostrarMas.style.display = 'block'; // Mostrar el botón "Mostrar más"
    currentIndex = 0; // Reiniciar el índice

    // Filtrar servicios si hay una categoría, de lo contrario usar todos
    filteredServicios = categoria ? allServicios.filter(s => s.categoria === categoria) : [...allServicios];
    mostrarServicios(filteredServicios.slice(0, ITEMS_PER_PAGE));

    // Ocultar el botón "Mostrar más" si no hay más servicios que mostrar
    if (filteredServicios.length <= ITEMS_PER_PAGE) {
      btnMostrarMas.style.display = 'none';
    }
  }
});
