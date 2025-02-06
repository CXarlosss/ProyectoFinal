// @ts-check

import { store } from "../store/redux.js";

import { simpleFetch } from "../lib/simpleFetch.js";


const API_PORT = 3001;

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM cargado correctamente.");

  // 📌 Selección de elementos del DOM

  const serviciosContainer =
    /** @type {HTMLDivElement | null} */ document.getElementById( "servicios-container");
  const btnFiltrarActividades =/** @type {HTMLButtonElement | null} */ document.getElementById( "btn-filtrar-actividades");
  const btnFiltrarComercios = /** @type {HTMLButtonElement | null} */ document.getElementById("btn-filtrar-comercios");
  const btnMostrarTodos =/** @type {HTMLButtonElement | null} */ document.getElementById("btn-mostrar-todos" );
  const btnCrearServicio =/** @type {HTMLButtonElement | null} */ document.getElementById( "btn-crear-servicio");
  const modalCrearServicio =/** @type {HTMLDivElement | null} */ document.getElementById( "modal-crear-servicio");
  const formCrearServicio =/** @type {HTMLFormElement | null} */ document.getElementById("crear-servicio-form");
  const btnCerrarModal = /** @type {HTMLButtonElement | null} */ document.getElementById(  "btn-cerrar-modal" );
  const inputBuscador = /** @type {HTMLInputElement | null} */ document.getElementById("buscador");
  const btnBuscador = /** @type {HTMLButtonElement | null} */ document.getElementById( "btn-buscador" );

  if (!serviciosContainer) {
    console.error("No se encontró el contenedor de servicios.");
    return;
  }
  // 📌 Verificar usuario registrado
  const usuarioGuardado = localStorage.getItem("usuarioRegistrado");

if (!usuarioGuardado) {
  alert("No hay usuario registrado.");
  window.location.href = "registrar.html";
  return;
}

/** @type {{ id: string, email: string }} */
const usuario = JSON.parse(usuarioGuardado);

console.log("📌 Usuario cargado desde localStorage:", usuario);


  /** @type {{ servicios: { id: string, nombre: string, descripcion: string, ubicacion: string, valoracion: string, imagen: string, categoria: string }[], favoritos: { id: string, nombre: string }[] }} */
  const state = {
    servicios: [],
    favoritos: [],
  };
  cargarServicios();
  cargarFavoritos();


   // 📌 Cargar servicios desde la API
   async function cargarServicios() {
    try {
      console.log("🔄 Cargando servicios desde la API backend...");
  
      const serviciosAPI = await simpleFetch(`http://${location.hostname}:${API_PORT}/read/servicios`, {
        signal: AbortSignal.timeout(3000),
        method: "GET",
      });
  
      if (!Array.isArray(serviciosAPI)) throw new Error("⚠️ La API no devolvió un array válido de servicios.");
  
      console.log("📌 Servicios cargados desde la API:", serviciosAPI);
  
      // ✅ Verificar si los servicios contienen `emailUsuario`
      serviciosAPI.forEach(servicio => {
        if (!servicio.emailUsuario) {
          console.warn(`⚠️ El servicio con ID ${servicio.id} no tiene emailUsuario.`);
        }
      });
  
      state.servicios = serviciosAPI;
      renderServicios(state.servicios);
    } catch (error) {
      console.error("🚨 Error en la carga de servicios:", error);
    }
  }
  
  // 📌 Evento para escuchar clics en botones de editar y eliminar
serviciosContainer.addEventListener("click", async (e) => {
  const target = /** @type {HTMLElement} */ (e.target);
  if (!target) return;

  // 📌 Editar servicio
  if (target.classList.contains("btn-editar")) {
    const id = target.getAttribute("data-id");
    const servicio = state.servicios.find((s) => s.id === id);

    if (!servicio) {
      console.error("Error: No se encontró el servicio a editar.");
      return;
    }

    // 📌 Aquí puedes abrir un modal o directamente editarlo en la UI
    const nuevoNombre = prompt("Nuevo nombre del servicio:", servicio.nombre);
    if (!nuevoNombre) return;

    const datosActualizados = { ...servicio, nombre: nuevoNombre };

    await actualizarServicio(id, datosActualizados);
  }

  // 📌 Eliminar servicio
  if (target.classList.contains("btn-eliminar")) {
    const id = target.getAttribute("data-id");
    if (!id) return;

    const confirmacion = confirm("¿Estás seguro de que quieres eliminar este servicio?");
    if (confirmacion) {
      await eliminarServicio(id);
    }
  }
});


/**
 * Renderiza la lista de servicios en la UI.
 * @param {typeof state.servicios} [serviciosFiltrados]
 */
function renderServicios(serviciosFiltrados = getServiciosDesdeStore()) {
  console.log("🛠 Ejecutando renderServicios con:", serviciosFiltrados);

  if (!serviciosContainer) {
    console.error("🚨 ERROR: El contenedor de servicios no está disponible.");
    return;
  }

  if (!serviciosFiltrados || serviciosFiltrados.length === 0) {
    serviciosContainer.innerHTML = "<p>No hay servicios disponibles.</p>";
    return;
  }

  serviciosContainer.innerHTML = serviciosFiltrados
  .slice(0, 7) // ✅ Mostrar solo 7 servicios
    .map((servicio) => {
      
      if (!servicio || !servicio.id) return "";
      let esPropietario = false;
      
      if (typeof usuario === "object" && usuario !== null && "email" in usuario &&
        typeof servicio === "object" && servicio !== null && "emailUsuario" in servicio) {
      esPropietario = usuario.email === servicio.emailUsuario;
    }

      return `
       <div class="card">
              <img src="${servicio.imagen || "default.jpg"}" alt="Imagen de ${servicio.nombre || "Servicio"}" class="card-img" />
              <h3>${servicio.nombre || "Nombre no disponible"}</h3>
              <p>${servicio.descripcion || "Descripción no disponible"}</p>
              <p><strong>Ubicación:</strong> ${servicio.ubicacion || "Ubicación no disponible"}</p>
              <p><strong>Valoración:</strong> ${servicio.valoracion || "No valorado"}</p>
              
              <!-- BOTÓN "MÁS DETALLES" -->
              <button class="btn-detalles" data-id="${servicio.id}">📜 Más Detalles</button>

              <!-- BOTÓN "AÑADIR A FAVORITOS" -->
              <button class="btn-favorito ${state.favoritos.some(fav => fav.id === servicio.id) ? "favorito" : ""}" data-id="${servicio.id}" data-nombre="${servicio.nombre || ""}">
                ${state.favoritos.some(fav => fav.id === servicio.id) ? "★ Favorito" : "☆ Añadir a Favoritos"}
              </button>

              <!-- BOTÓN EDITAR (SOLO SI EL USUARIO ES EL PROPIETARIO) -->
              ${esPropietario ? `<button class="btn-editar" data-id="${servicio.id}">✏️ Editar</button>` : ""}

              <!-- BOTÓN ELIMINAR (SOLO SI EL USUARIO ES EL PROPIETARIO) -->
              ${esPropietario ? `<button class="btn-eliminar" data-id="${servicio.id}">🗑 Eliminar</button>` : ""}
          </div>
    `;
  })
  .join("");

  console.log("✅ Servicios renderizados en la UI.");
}
serviciosContainer.addEventListener("click", async (e) => {
  const target = /** @type {HTMLElement} */ (e.target);
  if (!target) return;

  if (target.classList.contains("btn-detalles")) {
    const id = target.getAttribute("data-id");
    console.log("📌 ID del servicio seleccionado:", id);

    if (id) {
      window.location.href = `serviciosin.html?id=${encodeURIComponent(id)}`;
    } else {
      console.error("❌ Error: No se encontró el ID del servicio.");
    }
  }

  // 📌 Añadir a Favoritos
  if (target.classList.contains("btn-favorito")) {
    const id = target.getAttribute("data-id");
    const nombre = target.getAttribute("data-nombre");

    if (id && nombre) {  // ✅ Asegurar que no son null
      toggleFavorito(id, nombre);
    } else {
      console.error("🚨 Error: ID o nombre inválido en el botón de favoritos.");
    }
  }

  // 📌 Editar servicio (Solo si el usuario es el propietario)
  if (target.classList.contains("btn-editar")) {
    const id = target.getAttribute("data-id");
    const servicio = state.servicios.find((s) => s.id === id);

    if (!servicio) {
      console.error("Error: No se encontró el servicio a editar.");
      return;
    }

    const nuevoNombre = prompt("Nuevo nombre del servicio:", servicio.nombre);
    if (!nuevoNombre) return;

    const datosActualizados = { ...servicio, nombre: nuevoNombre };

    await actualizarServicio(id, datosActualizados);
  }

  // 📌 Eliminar servicio (Solo si el usuario es el propietario)
  if (target.classList.contains("btn-eliminar")) {
    const id = target.getAttribute("data-id");
    if (!id) return;

    const confirmacion = confirm("¿Estás seguro de que quieres eliminar este servicio?");
    if (confirmacion) {
      await eliminarServicio(id);
    }
  }
});

/**
 * Añadir o quitar un servicio de favoritos
 * @param {string} id
 * @param {string} nombre
 */
function toggleFavorito(id, nombre) {
  const index = state.favoritos.findIndex((fav) => fav.id === id);

  if (index !== -1) {
    state.favoritos.splice(index, 1);
  } else {
    state.favoritos.push({ id, nombre });
  }

  guardarFavoritos();
  renderServicios();
}

function guardarFavoritos() {
  localStorage.setItem(`favoritos_${usuario.id}`, JSON.stringify(state.favoritos));
}

function cargarFavoritos() {
  const favoritosGuardados = localStorage.getItem(`favoritos_${usuario.id}`);
  state.favoritos = favoritosGuardados ? JSON.parse(favoritosGuardados) : [];
}
  /**
   * @param {any} id
   * @param {any} datosActualizados
   */
   // 📌 Función para actualizar un servicio
   async function actualizarServicio(id, datosActualizados) {
    try {
      console.log(`📌 Actualizando servicio con ID ${id}:`, datosActualizados);

      const response = await fetch(`http://${location.hostname}:${API_PORT}/update/servicios/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosActualizados),
      });

      if (!response.ok) throw new Error(`Error en la actualización: ${response.statusText}`);

      console.log(`✅ Servicio con ID ${id} actualizado correctamente.`);
      cargarServicios(); // Recargar la UI
    } catch (error) {
      console.error("🚨 Error al actualizar el servicio:", error);
    }
  }

  // 📌 Función para eliminar un servicio
  /**
   * @param {any} id
   */
  async function eliminarServicio(id) {
    try {
      console.log(`📌 Eliminando servicio con ID ${id}...`);

      const response = await fetch(`http://${location.hostname}:${API_PORT}/delete/servicios/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error(`Error en la eliminación: ${response.statusText}`);

      console.log(`✅ Servicio con ID ${id} eliminado correctamente.`);
      cargarServicios(); // Recargar la UI
    } catch (error) {
      console.error("🚨 Error al eliminar el servicio:", error);
    }
  }

  function buscarServicios() {
    const inputBuscador = /** @type {HTMLInputElement | null} */ (
      document.getElementById("buscador")
    );

    if (!inputBuscador) {
      console.error("El campo de búsqueda no fue encontrado en el DOM.");
      return;
    }

    // Obtener el valor real del input, asegurando que no modifique el atributo 'value' de forma incorrecta
    const terminoBusqueda = inputBuscador.value.trim().toLowerCase();

    if (!terminoBusqueda) {
      renderServicios(); // Si está vacío, mostrar todos los servicios
      return;
    }

    try {
      /** @type {Array<{ id: string, nombre: string, descripcion: string, ubicacion: string, valoracion: string, imagen: string, categoria: string }>} */
      const serviciosFiltrados = state.servicios.filter(
        (servicio) =>
          servicio?.nombre?.toLowerCase()?.includes(terminoBusqueda) ||
          servicio?.descripcion?.toLowerCase()?.includes(terminoBusqueda) ||
          servicio?.ubicacion?.toLowerCase()?.includes(terminoBusqueda)
      );

      renderServicios(serviciosFiltrados);
    } catch (error) {
      console.error("Error al buscar servicios:", error);
    }
  }

  function getServiciosDesdeStore() {
    return store.getState().servicios;
  }
  
 
  // 📌 Mostrar modal de creación
  btnCrearServicio?.addEventListener("click", () => {
    modalCrearServicio?.classList.remove("hidden");
  });
  // 📌 Cerrar modal de creación
  btnCerrarModal?.addEventListener("click", () => {
    modalCrearServicio?.classList.add("hidden");
  });

  btnFiltrarActividades?.addEventListener("click", () =>
    renderServicios(
      state.servicios.filter(({ categoria }) => categoria === "actividad")
    )
  );
  btnFiltrarComercios?.addEventListener("click", () =>
    renderServicios(
      state.servicios.filter(({ categoria }) => categoria === "comercio")
    )
  );
  btnMostrarTodos?.addEventListener("click", () => {
    renderServicios(state.servicios);
  });

  // 📌 Eventos de búsqueda
  btnBuscador?.addEventListener("click", buscarServicios);
  inputBuscador?.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      buscarServicios();
    }
  });
  // 📌 Crear nuevo servicio desde el formulario
  formCrearServicio?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nuevoServicio = {
      id: Number(Date.now().toString()),
      nombre: /** @type {HTMLInputElement} */ (
        document.getElementById("nombre-servicio")
      ).value,
      descripcion: /** @type {HTMLInputElement} */ (
        document.getElementById("descripcion-servicio")
      ).value,
      ubicacion: /** @type {HTMLInputElement} */ (
        document.getElementById("ubicacion-servicio")
      ).value,
      valoracion: Number(
        /** @type {HTMLInputElement} */(
          document.getElementById("valoracion-servicio")
        ).value
      ),
      imagen:
        /** @type {HTMLInputElement} */ (
          document.getElementById("imagen-servicio")
        ).value || "default.jpg",
      categoria: /** @type {HTMLInputElement} */ (
        document.getElementById("categoria-servicio")
      ).value,
      precio: Number(
        /** @type {HTMLInputElement} */(
          document.getElementById("precio-servicio")
        ).value
      ),
      horarios: /** @type {HTMLInputElement} */ (
        document.getElementById("horario-servicio")
      ).value,
      metodoPago: /** @type {HTMLInputElement} */ (
        document.getElementById("metodo-pago-servicio")
      ).value,
      etiquetas: /** @type {HTMLInputElement} */ (
        document.getElementById("etiquetas-servicio")
      ).value,
      usuarioId: usuario ? usuario.id : null,
      emailUsuario: usuario ? usuario.email : null
    };

    try {
      console.log("📌 Enviando nuevo servicio a la API:", nuevoServicio);
  
      const response = await fetch(`http://${location.hostname}:${API_PORT}/create/servicios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Enviar como JSON
        },
        body: JSON.stringify(nuevoServicio), // Convertir a JSON
      });
  
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }
  
      const apiData = await response.json();
      console.log("✅ Servicio creado correctamente:", apiData);
  
      // Actualizar la UI
      cargarServicios(); // Recargar servicios desde la API
      modalCrearServicio?.classList.add("hidden");
      formCrearServicio?.setAttribute("reset", "");
  
    } catch (error) {
      console.error("🚨 Error al crear el servicio:", error);
    }
  })
  // 📌 Evento para escuchar clics en botones de editar y eliminar
  serviciosContainer.addEventListener("click", (e) => {
    const target = /** @type {HTMLElement} */ (e.target);
    if (!target) return;

    // 📌 Editar servicio
    if (target.classList.contains("btn-editar")) {
      const id = target.getAttribute("data-id");
      const servicio = state.servicios.find((s) => s.id === id);

      if (!servicio) {
        console.error("Error: No se encontró el servicio a editar.");
        return;
      }

      // 📌 Aquí abrirías un modal con los datos del servicio a editar
      const datosActualizados = { ...servicio, nombre: "Nuevo Nombre" }; // Simulación de edición
      actualizarServicio(id, datosActualizados);
    }

    // 📌 Eliminar servicio
    if (target.classList.contains("btn-eliminar")) {
      const id = target.getAttribute("data-id");
      if (!id) return;

      const confirmacion = confirm("¿Estás seguro de que quieres eliminar este servicio?");
      if (confirmacion) {
        eliminarServicio(id);
      }
    }
  });

  // 📌 Cargar servicios al inicio
  cargarServicios();
});