// @ts-check

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM cargado correctamente.");

  /** @type {HTMLElement | null} */
  const serviciosContainer = document.getElementById("servicios-container");

  if (!serviciosContainer) {
    console.error("No se encontró el contenedor de servicios.");
    return;
  }

  // Verificar si hay un usuario logueado
  const usuarioGuardado = localStorage.getItem("usuarioRegistrado");
  if (!usuarioGuardado) {
    alert("No hay usuario registrado.");
    window.location.href = "registrar.html";
    return;
  }

  /** @type {{ id: string, nombre: string }} */
  const usuario = JSON.parse(usuarioGuardado);

  /** @type {{ servicios: { id: string, nombre: string, descripcion: string, precio: number, valoracion: number, ubicacion: string, horarios: string, metodoPago: string, categoria: string, imagen: string, etiquetas: string[], favorito?: boolean }[], favoritos: { id: string, nombre: string }[] }} */
  const state = {
    servicios: [],
    favoritos: []
  };

  /**
   * Cargar los favoritos almacenados del usuario.
   */
  function cargarFavoritos() {
    const favoritosGuardados = localStorage.getItem(`favoritos_${usuario.id}`);
    state.favoritos = favoritosGuardados ? JSON.parse(favoritosGuardados) : [];
    console.log(`Favoritos cargados para ${usuario.nombre}:`, state.favoritos);
  }

  /**
   * Guardar los favoritos del usuario en `localStorage`.
   */
  function guardarFavoritos() {
    localStorage.setItem(`favoritos_${usuario.id}`, JSON.stringify(state.favoritos));
    console.log(`Favoritos guardados para ${usuario.nombre}:`, state.favoritos);
    
  }

  /**
   * Renderiza los servicios en el contenedor.
   */
  function renderServicios() {
    if (!serviciosContainer) {
      console.error("Error: No se encontró el contenedor de servicios.");
      return;
    }

    serviciosContainer.innerHTML = state.servicios
      .map(servicio => {
        const isFavorito = state.favoritos.some(fav => fav.id === servicio.id);
        return `
          <div class="card">
            <img src="${servicio.imagen}" alt="Imagen de ${servicio.nombre}" class="card-img" />
            <h3>${servicio.nombre}</h3>
            <p>${servicio.descripcion}</p>
            <p><strong>Ubicación:</strong> ${servicio.ubicacion}</p>
            <p><strong>Valoración:</strong> ${servicio.valoracion}</p>
            <button class="btn-favorito ${isFavorito ? "favorito" : ""}" data-id="${servicio.id}" data-nombre="${servicio.nombre}">
              ${isFavorito ? "★ Favorito" : "☆ Añadir a Favoritos"}
            </button>
            <button class="btn-mensaje" data-id="${servicio.id}">Enviar Mensaje</button>
          </div>
        `;
      })
      .join("");

    console.log("Servicios renderizados correctamente.");
  }

  /**
   * Marca o desmarca un servicio como favorito.
   * @param {string} id - ID del servicio.
   * @param {string} nombre - Nombre del servicio.
   */
  function toggleFavorito(id, nombre) {
    const existe = state.favoritos.some(fav => fav.id === id);

    if (existe) {
      state.favoritos = state.favoritos.filter(fav => fav.id !== id);
    } else {
      state.favoritos.push({ id, nombre });
    }

    guardarFavoritos();
    renderServicios();
  }

  // Eventos de botones
  serviciosContainer.addEventListener("click", e => {
    const target = /** @type {HTMLElement} */ (e.target);
    if (!target) return;

    const id = target.dataset.id;
    const nombre = target.dataset.nombre;

    if (!id || !nombre) return;

    if (target.classList.contains("btn-favorito")) {
      toggleFavorito(id, nombre);
    }
  });

  // Cargar servicios y favoritos antes de renderizar
  fetch("./api/factory.json")
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error al cargar JSON: ${response.status}`);
      }
      return response.json();
    })
    .then(
      /**
       * @param {{ servicios: { id: string, nombre: string, descripcion: string, precio: number, valoracion: number, ubicacion: string, horarios: string, metodoPago: string, categoria: string, imagen: string, etiquetas: string[] }[] }} data
       */
      data => {
        console.log("Servicios cargados:", data.servicios);
        state.servicios = data.servicios;
        cargarFavoritos();
        renderServicios();
      }
    )
    .catch(error => {
      console.error("Error al cargar los servicios:", error);
    });
});
