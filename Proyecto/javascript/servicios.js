//@ts-check
// Variables globales
/**
 * @type {{ id: string; nombre: string; descripcion: string; ubicacion: string; valoracion: string; imagen: string; }[]}
 */
let allServicios = [];
let filteredServicios = [];
const ITEMS_PER_PAGE = 10;

document.addEventListener('DOMContentLoaded', () => {
  const serviciosContainer = document.getElementById('servicios-container');
  const btnCrearServicio = document.getElementById('btn-crear-servicio');
  const modalCrearServicio = document.getElementById('modal-crear-servicio');
  const formCrearServicio = document.getElementById('crear-servicio-form');
  const btnCerrarModal = document.getElementById('btn-cerrar-modal');

  // Cargar los servicios iniciales desde el archivo JSON
  cargarServicios();

  // Mostrar el modal al hacer clic en "Crear Servicio"
  btnCrearServicio?.addEventListener('click', () => {
    limpiarFormulario();
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
    const descripcion = document.getElementById('descripcion-servicio')?.setAttribute("value","") ||'';
    const ubicacion = document.getElementById('ubicacion-servicio')?.setAttribute("value","") ||'';
    const valoracion = document.getElementById('valoracion-servicio')?.setAttribute("value","") ||'';
    const imagen = document.getElementById('imagen-servicio')?.setAttribute("value","") ||'';

    // Validar campos
    if (!nombre || !descripcion || !ubicacion || !valoracion || !imagen) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    // Crear un nuevo servicio
    const nuevoServicio = {
      id: Date.now().toString(),
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
 * Limpia los campos del formulario antes de abrir el modal.
 */
function limpiarFormulario() {
  document.getElementById('nombre-servicio')?.setAttribute("value","") ||'';
  document.getElementById('descripcion-servicio')?.setAttribute("value","") ||'';
  document.getElementById('ubicacion-servicio')?.setAttribute("value","") ||'';
  document.getElementById('valoracion-servicio')?.setAttribute("value","") ||'';
  document.getElementById('imagen-servicio')?.setAttribute("value","") ||'';
}

/**
 * Cargar servicios desde un archivo JSON.
 */
async function cargarServicios() {
  try {
    const response = await fetch('./api/factory.json');
    if (!response.ok) {
      throw new Error('No se pudo cargar los servicios');
    }
    allServicios = await response.json();
    filteredServicios = [...allServicios];
    mostrarServicios(filteredServicios.slice(0, ITEMS_PER_PAGE));
  } catch (error) {
    console.error('Error cargando servicios:', error);
  }
}

/**
 * Renderiza los servicios en el contenedor.
 * @param {{ id: string; nombre: string; descripcion: string; ubicacion: string; valoracion: string; imagen: string; }[]} servicios
 */
function mostrarServicios(servicios) {
  const serviciosContainer = document.getElementById('servicios-container');
  if (serviciosContainer) {
    serviciosContainer.innerHTML = '';
    servicios.forEach((servicio) => {
      const servicioElement = document.createElement('div');
      servicioElement.classList.add('card');

      servicioElement.innerHTML = `
        <img class="card-img" src="${servicio.imagen}" alt="${servicio.nombre}">
        <h3 class="card-title">${servicio.nombre}</h3>
        <p class="card-desc">${servicio.descripcion}</p>
        <p class="card-location">Ubicación: ${servicio.ubicacion}</p>
        <p class="card-rating">Valoración: ${servicio.valoracion}</p>
      `;
      serviciosContainer.appendChild(servicioElement);
    });
  }
}
