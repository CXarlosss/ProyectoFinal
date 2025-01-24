// @ts-check

/** @type {HTMLFormElement | null}  */
const crearServicioForm = /** @type {HTMLFormElement | null} */ (document.getElementById("crearServicioForm")) || null;
/** @type {HTMLElement | null} */
const listaServicios = document.getElementById("listaServicios");

/** @type {Array<{nombre: string, descripcion: string}>} */
let servicios = [];

/**
 * Renderiza los servicios en la lista.
 */
function renderizarServicios() {
    if (!listaServicios) return;

    // Limpiar la lista antes de volver a renderizar
    listaServicios.innerHTML = "<h2>Servicios Actuales</h2>";

    // Verificar si hay servicios
    if (servicios.length === 0) {
        listaServicios.innerHTML += "<p>No hay servicios disponibles en este momento.</p>";
        return;
    }

    // Crear elementos HTML para cada servicio
    servicios.forEach((servicio, index) => {
        const servicioDiv = document.createElement("div");
        servicioDiv.className = "servicio";

        servicioDiv.innerHTML = `
            <h3>${servicio.nombre}</h3>
            <p>${servicio.descripcion}</p>
            <button class="btn-secondary" onclick="eliminarServicio(${index})">Eliminar</button>
        `;

        listaServicios.appendChild(servicioDiv);
    });
}

/**
 * Maneja el envío del formulario de creación de servicio.
 * @param {SubmitEvent} event
 */
crearServicioForm?.addEventListener("submit", (event) => {
    event.preventDefault(); // Evitar el comportamiento por defecto del formulario

    // Obtener los valores del formulario
    /** @type {HTMLInputElement | null} */
    const nombreServicioElement = /** @type {HTMLInputElement | null} */ (document.getElementById("nombreServicio"));
    /** @type {HTMLTextAreaElement | null} */
    const descripcionServicioElement = /** @type {HTMLTextAreaElement | null} */ (document.getElementById("descripcionServicio"));

    const nombreServicio = nombreServicioElement?.value.trim() || "";
    const descripcionServicio = descripcionServicioElement?.value.trim() || "";

    // Validar que ambos campos estén completos
    if (!nombreServicio || !descripcionServicio) {
        alert("Por favor, completa todos los campos del formulario.");
        return;
    }

    // Crear un nuevo servicio y agregarlo al array
    servicios.push({ 
        nombre: nombreServicio, 
        descripcion: descripcionServicio 
    });

    // Limpiar el formulario y actualizar la lista
    crearServicioForm.reset();
    renderizarServicios();
});

/**
 * Elimina un servicio de la lista.
 * @param {number} index
 */
function eliminarServicio(index) {
    servicios.splice(index, 1); // Eliminar el servicio del array
    renderizarServicios(); // Renderizar la lista actualizada
}

/**
 * Carga algunos servicios por defecto para pruebas.
 */
function cargarServiciosIniciales() {
    servicios = [
        { nombre: "Clases de Inglés", descripcion: "Clases particulares para todos los niveles." },
        { nombre: "Reparación de Electrodomésticos", descripcion: "Servicio rápido y profesional." },
        { nombre: "Diseño Gráfico", descripcion: "Creación de logotipos y material publicitario." }
    ];
    renderizarServicios();
}

// Cargar servicios iniciales para mostrar ejemplos
cargarServiciosIniciales();