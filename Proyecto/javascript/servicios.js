// @ts-check

 import { store, loadServicesFromAPI } from "../store/redux.js"
 

 
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM cargado correctamente.");
  loadServicesFromAPI("./api/factory.json");

  // 📌 Selección de elementos del DOM
  
  const serviciosContainer =/** @type {HTMLDivElement | null} */ document.getElementById("servicios-container") ;
  const btnFiltrarActividades = /** @type {HTMLButtonElement | null} */ document.getElementById("btn-filtrar-actividades");
  const btnFiltrarComercios =/** @type {HTMLButtonElement | null} */ document.getElementById("btn-filtrar-comercios");
  const btnMostrarTodos =  /** @type {HTMLButtonElement | null} */document.getElementById("btn-mostrar-todos");
  const btnCrearServicio =  /** @type {HTMLButtonElement | null} */document.getElementById("btn-crear-servicio");
  const modalCrearServicio = /** @type {HTMLDivElement | null} */ document.getElementById("modal-crear-servicio");
  const formCrearServicio =/** @type {HTMLFormElement | null} */ document.getElementById("crear-servicio-form");
  const btnCerrarModal = /** @type {HTMLButtonElement | null} */document.getElementById("btn-cerrar-modal");
  const inputBuscador = /** @type {HTMLInputElement | null} */ document.getElementById("buscador");
  const btnBuscador =/** @type {HTMLButtonElement | null} */ document.getElementById("btn-buscador");

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
  /** @type {{ id: string }} */
  const usuario = JSON.parse(usuarioGuardado);

  /** @type {{ servicios: { id: string, nombre: string, descripcion: string, ubicacion: string, valoracion: string, imagen: string, categoria: string }[], favoritos: { id: string, nombre: string }[] }} */
  const state = {
      servicios: [],
      favoritos: [],
  };
  cargarServicios();
  cargarFavoritos();
  // 📌 Cargar servicios desde JSON
  function cargarServicios() {
    fetch("./api/factory.json")
        .then((response) => {
            if (!response.ok) throw new Error(`❌ Error al cargar JSON: ${response.status}`);
            return response.json();
        })
        .then((data) => {
            console.log("📌 Servicios obtenidos de la API:", data.servicios);

            if (!Array.isArray(data.servicios) || data.servicios.length === 0) {
                console.warn("⚠️ No se encontraron servicios en el JSON.");
                return;
            }

            // 🔴 SOLUCIÓN: Guardar los servicios en `localStorage`
            localStorage.setItem("servicios", JSON.stringify(data.servicios));
            console.log("✅ Servicios guardados en LocalStorage:", localStorage.getItem("servicios"));

            // Actualizar el estado y renderizar la interfaz
            state.servicios = data.servicios;
            renderServicios();
        })
        .catch((error) => console.error("❌ Error al cargar los servicios:", error));
}



    function getServiciosDesdeStore() {
    return store.getState().servicios;
}
 
  function guardarFavoritos() {
      localStorage.setItem(
          `favoritos_${usuario.id}`,
          JSON.stringify(state.favoritos)
      );
  }
 /**
 * Renderiza la lista de servicios en la interfaz.
 * @param {typeof state.servicios} [serviciosFiltrados]
 */
function renderServicios(serviciosFiltrados = getServiciosDesdeStore()) {
    if (!serviciosContainer) {
        console.error("El contenedor de servicios no está disponible.");
        return;
    }

    serviciosContainer.innerHTML = (serviciosFiltrados || [])
        .slice(0, 8)
        .map((servicio) => {
            if (!servicio) {
                console.warn("Servicio no definido.");
                return '';
            }
            const isFavorito = state.favoritos.some(
                (fav) => fav.id === servicio.id
            );
            return `
            <div class="card">
                <img src="${servicio.imagen || 'default.jpg'}" alt="Imagen de ${servicio.nombre || 'Servicio'}" class="card-img" />
                <h3>${servicio.nombre || 'Nombre no disponible'}</h3>
                <p>${servicio.descripcion || 'Descripción no disponible'}</p>
                <p><strong>Ubicación:</strong> ${servicio.ubicacion || 'Ubicación no disponible'}</p>
                <p><strong>Valoración:</strong> ${servicio.valoracion || 'No valorado'}</p>
                <button class="btn-favorito ${isFavorito ? "favorito" : ""}" 
                    data-id="${servicio.id}" 
                    data-nombre="${servicio.nombre || ''}">
                    ${isFavorito ? "★ Favorito" : "☆ Añadir a Favoritos"}
                </button>
                <button class="btn-detalles" data-id="${servicio.id}" 
                    data-nombre="${encodeURIComponent(servicio.nombre || '')}">
                    Detalles
                </button>
            </div>
        `;
        })
        .join("");

    try {
        cargarFavoritos();
        
    } catch (error) {
        console.error("Error al cargar favoritos:", error);
        
    }
}
  // 📌 Mostrar modal de creación
  btnCrearServicio?.addEventListener("click", () => {
      modalCrearServicio?.classList.remove("hidden");
  });
  // 📌 Cerrar modal de creación
  btnCerrarModal?.addEventListener("click", () => {
      modalCrearServicio?.classList.add("hidden");
  });
  function guardarServiciosEnJSON() {
      localStorage.setItem("./api/factory.json", JSON.stringify(state.servicios));
      console.log("Servicios guardados en LocalStorage.");
  }
  // 📌 Crear nuevo servicio desde el formulario
  formCrearServicio?.addEventListener("submit", (e) => {
      e.preventDefault();

      const nuevoServicio = {
          id: Number(Date.now().toString()),
          nombre: /** @type {HTMLInputElement} */ (document.getElementById("nombre-servicio")).value,
          descripcion: /** @type {HTMLInputElement} */ (document.getElementById("descripcion-servicio")).value,
          ubicacion: /** @type {HTMLInputElement} */ (document.getElementById("ubicacion-servicio")).value,
          valoracion:  Number(/** @type {HTMLInputElement} */(document.getElementById("valoracion-servicio")).value),
          imagen: /** @type {HTMLInputElement} */ (document.getElementById("imagen-servicio")).value || "default.jpg",
          categoria: /** @type {HTMLInputElement} */ (document.getElementById("categoria-servicio")).value,
          precio: Number(/** @type {HTMLInputElement} */ (document.getElementById("precio-servicio")).value),
          horarios: /** @type {HTMLInputElement} */ (document.getElementById("horario-servicio")).value,
          metodoPago: /** @type {HTMLInputElement} */ (document.getElementById("metodo-pago-servicio")).value,
          etiquetas: /** @type {HTMLInputElement} */ (document.getElementById("etiquetas-servicio")).value,
          usuarioId: Number((/** @type {HTMLInputElement} */ (document.getElementById("usuario-id-servicio"))).value),
          emailUsuario: /** @type {HTMLInputElement} */ (document.getElementById("email-usuario-servicio")).value
      };

      store.article.create(nuevoServicio);
      renderServicios();
      guardarServiciosEnJSON();

      modalCrearServicio?.classList.add("hidden");
      formCrearServicio?.setAttribute('reset' , '');

      // 📌 Escuchar cambios en el estado global
    window.addEventListener("stateChanged", () => {
        renderServicios();
    });

    // 📌 Renderizar servicios al cargar
   
    renderServicios();
    });
  /**
   * Alterna el estado de un servicio en la lista de favoritos.
   * @param {string} id 
   * @param {string} nombre 
   */

function toggleFavorito(id, nombre) {
    if (!id) {
        console.error("ID de servicio inválido.");
        return;
    }

    const index = state.favoritos.findIndex((fav) => fav.id === id);

    if (index !== -1) {
        // Si ya es favorito, lo elimina
        state.favoritos.splice(index, 1);
    } else {
        // Si no está en favoritos, lo añade
        state.favoritos.push({ id, nombre });
    }

    // Guardar cambios en localStorage
    guardarFavoritos();

    // ✅ Volver a renderizar los servicios para reflejar el cambio
    renderServicios();
}
  btnFiltrarActividades?.addEventListener("click", () =>
      renderServicios(state.servicios.filter(({ categoria }) => categoria === "actividad"))
  );
  btnFiltrarComercios?.addEventListener("click", () =>
      renderServicios(state.servicios.filter(({ categoria }) => categoria === "comercio"))
  );
  btnMostrarTodos?.addEventListener("click", () => {
      renderServicios(state.servicios);
  });
  function buscarServicios() {
    const inputBuscador = /** @type {HTMLInputElement | null} */ (document.getElementById("buscador"));
    
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

// 📌 Eventos de búsqueda
btnBuscador?.addEventListener("click", buscarServicios);
inputBuscador?.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        buscarServicios();
    }
});
  function cargarFavoritos() {
      const favoritosGuardados = localStorage.getItem(`favoritos_${usuario.id}`);
      state.favoritos = favoritosGuardados
          ? JSON.parse(favoritosGuardados)
          : [];
  }
  serviciosContainer.addEventListener("click", (e) => {
    const target = /** @type {HTMLElement} */ (e.target);
    if (!target) return;

    // 📌 Manejar clic en el botón de favorito
    if (target.classList.contains("btn-favorito")) {
        const id = target.getAttribute("data-id");
        const nombre = target.getAttribute("data-nombre");

        if (id && nombre) {
            toggleFavorito(id, nombre);
        } else {
            console.error("Error: ID o nombre del servicio no encontrado.");
        }
        return; // 🔴 IMPORTANTE: Evita que se siga ejecutando el resto del código
    }

    // 📌 Manejar clic en el botón de detalles
    if (target.classList.contains("btn-detalles")) {
        const servicioId = target.getAttribute("data-id");

        if (servicioId) {
            console.log("Redirigiendo a detalles del servicio:", servicioId);
            window.location.href = `serviciosin.html?id=${servicioId}`;
        } else {
            console.error("Error: No se encontró el ID del servicio.");
        }
        return; // 🔴 IMPORTANTE: Evita que se siga ejecutando el resto del código
    }
});
console.log(localStorage.getItem("servicios"));

});

