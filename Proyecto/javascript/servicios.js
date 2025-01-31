/*  import { store } from "../store/redux.js"
 */
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM cargado correctamente.");

    // 📌 Selección de elementos del DOM
    const serviciosContainer = document.getElementById("servicios-container");
    const btnFiltrarActividades = document.getElementById(
      "btn-filtrar-actividades"
    );
    const btnFiltrarComercios = document.getElementById(
      "btn-filtrar-comercios"
    );
    const btnMostrarTodos = document.getElementById("btn-mostrar-todos");
    const btnCrearServicio = document.getElementById("btn-crear-servicio");
    const modalCrearServicio = document.getElementById("modal-crear-servicio");
    const formCrearServicio = document.getElementById("crear-servicio-form");
    const btnCerrarModal = document.getElementById("btn-cerrar-modal");

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

    const usuario = JSON.parse(usuarioGuardado);
    const state = {
      servicios: [],
      favoritos: [],
    };
    // 📌 Cargar servicios desde JSON
    function cargarServicios() {
      fetch("./api/factory.json")
        .then((response) => {
          if (!response.ok)
            throw new Error(`Error al cargar JSON: ${response.status}`);
          return response.json();
        })
        .then((data) => {
          console.log("Servicios cargados:", data.servicios);
          state.servicios = data.servicios;
          renderServicios();
        })
        .catch((error) =>
          console.error("Error al cargar los servicios:", error)
        );
    }

    function cargarFavoritos() {
      const favoritosGuardados = localStorage.getItem(
        `favoritos_${usuario.id}`
      );
      state.favoritos = favoritosGuardados
        ? JSON.parse(favoritosGuardados)
        : [];
    }

    function guardarFavoritos() {
      localStorage.setItem(
        `favoritos_${usuario.id}`,
        JSON.stringify(state.favoritos)
      );
    }

    function renderServicios(serviciosFiltrados = state.servicios) {
      serviciosContainer.innerHTML = serviciosFiltrados
        .map((servicio) => {
          const isFavorito = state.favoritos.some(
            (fav) => fav.id === servicio.id
          );
          return `
          <div class="card">
            <img src="${servicio.imagen}" alt="Imagen de ${
            servicio.nombre
          }" class="card-img" />
            <h3>${servicio.nombre}</h3>
            <p>${servicio.descripcion}</p>
            <p><strong>Ubicación:</strong> ${servicio.ubicacion}</p>
            <p><strong>Valoración:</strong> ${servicio.valoracion}</p>
            <button class="btn-favorito ${
              isFavorito ? "favorito" : ""
            }" data-id="${servicio.id}" data-nombre="${servicio.nombre}">
              ${isFavorito ? "★ Favorito" : "☆ Añadir a Favoritos"}
            </button>
            <button class="btn-mensaje" data-id="${
              servicio.id
            }" data-nombre="${encodeURIComponent(servicio.nombre)}">
              Enviar Mensaje
            </button>
          </div>
        `;
        })
        .join("");
      cargarFavoritos(); //cargarFavoritos();

      console.log("Servicios renderizados correctamente.");
    }
    // 📌 Mostrar modal de creación
    btnCrearServicio.addEventListener("click", () => {
      modalCrearServicio.classList.remove("hidden");
    });

    // 📌 Cerrar modal de creación
    btnCerrarModal.addEventListener("click", () => {
      modalCrearServicio.classList.add("hidden");
    });

    function guardarServiciosEnJSON() {
      localStorage.setItem("./api/factory.json", JSON.stringify(state.servicios));
      console.log("Servicios guardados en LocalStorage.");
    }

    // 📌 Crear nuevo servicio desde el formulario
    formCrearServicio.addEventListener("submit", (e) => {
      e.preventDefault();

      const nuevoServicio = {
        id: Date.now().toString(), // Generar un ID único
        nombre: document.getElementById("nombre-servicio").value,
        descripcion: document.getElementById("descripcion-servicio").value,
        ubicacion: document.getElementById("ubicacion-servicio").value,
        valoracion: document.getElementById("valoracion-servicio").value,
        imagen:
          document.getElementById("imagen-servicio").value || "default.jpg",
        categoria: document.getElementById("categoria-servicio").value,
      };

      // Agregar el servicio a la lista
      state.servicios.push(nuevoServicio);
      renderServicios();
      guardarServiciosEnJSON();

      // Cerrar el modal y limpiar el formulario
      modalCrearServicio.classList.add("hidden");
      formCrearServicio.reset();

      console.log("Nuevo servicio agregado:", nuevoServicio);
    });

    // 📌 Cargar servicios al inicio
    cargarServicios();

    function toggleFavorito(id, nombre) {
      const existe = state.favoritos.some((fav) => fav.id === id);
      if (existe) {
        state.favoritos = state.favoritos.filter((fav) => fav.id !== id);
      } else {
        state.favoritos.push({ id, nombre });
      }
      guardarFavoritos();
      renderServicios();
    }

    serviciosContainer.addEventListener("click", (e) => {
      const target = e.target;
      if (!target) return;

      if (target.classList.contains("btn-favorito")) {
        toggleFavorito(target.dataset.id, target.dataset.nombre);
      }
    });

    // 📌 Filtrar actividades
    btnFiltrarActividades.addEventListener("click", () => {
      renderServicios(
        state.servicios.filter((servicio) => servicio.categoria === "actividad")
      );
    });

    // 📌 Filtrar comercios
    btnFiltrarComercios.addEventListener("click", () => {
      renderServicios(
        state.servicios.filter((servicio) => servicio.categoria === "comercio")
      );
    });

    // 📌 Mostrar todos
    btnMostrarTodos.addEventListener("click", () => {
      renderServicios(state.servicios);
    });
  })
 

