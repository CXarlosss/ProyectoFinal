// @ts-check

import { store } from "../store/redux.js";




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

/** @type {{ _id: string, email: string }} */
const usuario = JSON.parse(usuarioGuardado);

console.log("📌 Usuario cargado desde localStorage:", usuario);









  /** @type {{ servicios: { _id: string, nombre: string, descripcion: string, ubicacion: string, valoracion: string, imagen: string, categoria: string }[], favoritos: { _id: string, nombre: string }[] }} */
  const state = {
    servicios: [],
    favoritos: [],
  };
  cargarServicios();
  cargarFavoritos();


   // 📌 Cargar servicios desde la API
   async function cargarServicios() {
    try {
        const serviciosAPI = await fetch(`http://${location.hostname}:3001/read/servicios`);
        const servicios = await serviciosAPI.json();

        console.log("📌 Servicios obtenidos después de actualizar:", servicios);

        if (!Array.isArray(servicios)) throw new Error("⚠️ La API no devolvió un array válido de servicios.");

        // 🚀 Actualizar el estado global
        state.servicios = servicios;

        // 🚀 Volver a renderizar los servicios en la UI
        renderServicios(state.servicios);
    } catch (error) {
        console.error("❌ Error al obtener servicios:", error);
    }
}

  


function renderServicios(serviciosFiltrados = getServiciosDesdeStore()) {
  console.log("🛠 Ejecutando renderServicios con:", serviciosFiltrados);

  if (!serviciosContainer) {
    console.error("🚨 ERROR: El contenedor de servicios no está disponible.");
    return;
  }

  if (!usuario || !usuario.email) {
    console.error("🚨 ERROR: El usuario no está definido o no tiene email.", usuario);
    return;
  }

  if (!serviciosFiltrados || serviciosFiltrados.length === 0) {
    console.warn("⚠ No hay servicios disponibles.");
    serviciosContainer.innerHTML = "<p>No hay servicios disponibles.</p>";
    return;
  }

  console.log("📌 Usuario actual:", usuario);

  serviciosFiltrados.forEach((/** @type {{ emailUsuario: string; nombre: any; }} */ servicio) => {
    console.log("📌 Revisando servicio:", servicio);
    console.log("📧 Comparando emails:", servicio.emailUsuario, usuario.email);

    if (!servicio.emailUsuario) {
      console.warn("⚠ El servicio no tiene emailUsuario definido:", servicio);
    }

    if (servicio.emailUsuario?.trim().toLowerCase() === usuario.email?.trim().toLowerCase()) {
      console.log("✅ Es propietario del servicio:", servicio.nombre);
    } else {
      console.log("❌ No es propietario");
    }
  });

  console.log("📌 Servicios filtrados:", serviciosFiltrados);

  serviciosContainer.innerHTML = serviciosFiltrados
    .slice(0, 7) // ✅ Mostrar solo 7 servicios
    .map((/** @type {{ _id: string; emailUsuario: string; imagen: any; nombre: any; descripcion: any; ubicacion: any; valoracion: any; }} */ servicio) => {
      if (!servicio || !servicio._id) return "";
      let esPropietario = false;

      console.log("📌 Servicio:", servicio);

      if (servicio.emailUsuario?.trim().toLowerCase() === usuario.email?.trim().toLowerCase()) {
        esPropietario = true;
      }

      return `
        <div class="card">
          <img src="${servicio.imagen || "default.jpg"}" alt="Imagen de ${servicio.nombre || "Servicio"}" class="card-img" />
          <h3>${servicio.nombre || "Nombre no disponible"}</h3>
          <p>${servicio.descripcion || "Descripción no disponible"}</p>
          <p><strong>Ubicación:</strong> ${servicio.ubicacion || "Ubicación no disponible"}</p>
          <p><strong>Valoración:</strong> ${servicio.valoracion || "No valorado"}</p>
          
          <!-- BOTÓN "MÁS DETALLES" -->
          <button class="btn-detalles" data-_id="${servicio._id}">📜 Más Detalles</button>

          <!-- BOTÓN "AÑADIR A FAVORITOS" -->
          <button class="btn-favorito ${state.favoritos.some(fav => fav._id === servicio._id) ? "favorito" : ""}" 
                  data-_id="${servicio._id}" 
                  data-nombre="${servicio.nombre || ""}">
            ${state.favoritos.some(fav => fav._id === servicio._id) ? "★ Favorito" : "☆ Añadir a Favoritos"}
          </button>

          <!-- BOTÓN EDITAR (SOLO SI EL USUARIO ES EL PROPIETARIO) -->
          ${esPropietario ? `<button class="btn-editar" data-_id="${String(servicio._id)}">✏️ Editar</button>` : ""}

    
          <!-- BOTÓN ELIMINAR (SOLO SI EL USUARIO ES EL PROPIETARIO) -->
          ${esPropietario ? `<button class="btn-eliminar" data-_id="${servicio._id}">🗑 Eliminar</button>` : ""}
        </div>
      `;
    })
    .join("");

    console.log("✅ Contenido final en serviciosContainer:");

}

serviciosContainer.addEventListener("click", async (e) => {
  const target = /** @type {HTMLElement} */ (e.target);
  if (!target) return;
    console.log("🛠 Clic detectado en:", target); //  Debugging
  if (target.classList.contains("btn-detalles")) {
    const _id = target.getAttribute("data-_id");
    console.log("📌 _id del servicio seleccionado:", _id);

    if (_id) {
      window.location.href = `serviciosin.html?_id=${encodeURIComponent(_id)}`;
    } else {
      console.error("❌ Error: No se encontró el _id del servicio.");
    }
  }

  // 📌 Añadir a Favoritos
  if (target.classList.contains("btn-favorito")) {
    const _id = target.getAttribute("data-_id");
    const nombre = target.getAttribute("data-nombre");

    if (_id && nombre) {  // ✅ Asegurar que no son null
      toggleFavorito(_id, nombre);
    } else {
      console.error("🚨 Error: _id o nombre inválido en el botón de favoritos.");
    }console.log("📌 _id del servicio a editar:", _id);
  }

   // 📌 EDITAR SERVICIO

if (target.classList.contains("btn-editar")) {
  console.log("🔍 Botón de editar detectado.");
  
  let _id = target.getAttribute("data-_id");
  console.log("📌 _id del servicio a editar:", _id);

  if (!_id || _id.length !== 24) {
      console.error("❌ ERROR: ID inválido para MongoDB:", _id);
      return;
  }

  _id = String(_id);

  const servicio = state.servicios.find((s) => String(s._id) === _id);

  console.log("🔍 Servicio encontrado:", servicio);

  if (!servicio) {
      console.error("❌ ERROR: No se encontró el servicio en el estado.");
      return;
  }

  // 🔥 Evitar múltiples clics en paralelo
  if (target.hasAttribute("disabled")) return;
  target.setAttribute("disabled", "");

  const nuevoNombre = prompt("Nuevo nombre del servicio:", servicio.nombre);
  if (!nuevoNombre) {
      target.removeAttribute("disabled"); // Re-enable the button if no edit
      return;
  }

  const { _id: id, ...updates } = servicio;
  updates.nombre = nuevoNombre;

  try {
      console.log("📌 Enviando actualización:", updates);
      
      const resultado = await actualizarServicio(id, updates);

      if (resultado) {
          console.log("✅ Servicio actualizado correctamente.");
          await cargarServicios();
      } else {
          console.error("❌ No se pudo actualizar el servicio.");
      }
  } catch (error) {
      console.error("❌ Error en la actualización del servicio:", error);
  } finally {
      target.removeAttribute("disabled"); // Habilitar el botón después de la actualización
  }
}


  // 📌 Eliminar servicio (Solo si el usuario es el propietario)
  if (target.classList.contains("btn-eliminar")) {
    const _id = target.getAttribute("data-_id");
    if (!_id) return;

    const confirmacion = confirm("¿Estás seguro de que quieres eliminar este servicio?");
    if (confirmacion) {
      await eliminarServicio(_id);
    }
  }
});

/**
 * Añadir o quitar un servicio de favoritos
 * @param {string} _id
 * @param {string} nombre
 */
function toggleFavorito(_id, nombre) {
  const index = state.favoritos.findIndex((fav) => fav._id === _id);

  if (index !== -1) {
    state.favoritos.splice(index, 1);
  } else {
    state.favoritos.push({ _id, nombre });
  }

  guardarFavoritos();
  renderServicios();
}

function guardarFavoritos() {
  localStorage.setItem(`favoritos_${usuario._id}`, JSON.stringify(state.favoritos));
}

function cargarFavoritos() {
  const favoritosGuardados = localStorage.getItem(`favoritos_${usuario._id}`);
  state.favoritos = favoritosGuardados ? JSON.parse(favoritosGuardados) : [];
}
  /**
   * @param {any} _id
   * @param {any} datosActualizados
   */
   // 📌 Función para actualizar un servicio
   async function actualizarServicio(_id, datosActualizados) {
    try {
        _id = String(_id).trim();

        if (!_id || _id.length !== 24) {
            console.error("❌ ERROR: ID inválido antes de la actualización.");
            return false;
        }

        console.log(`📌 Enviando actualización para el servicio con _id ${_id}:`, datosActualizados);

        const response = await fetch(`http://${location.hostname}:3001/update/servicios/${_id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datosActualizados),
        });

        if (!response.ok) {
            throw new Error(`Error en la actualización: ${response.statusText}`);
        }

        const resultado = await response.json();

        console.log(`✅ Servicio con _id ${_id} actualizado correctamente.`, resultado);
        
        // 🚀 ACTUALIZAR `state.servicios` PARA EVITAR DATOS ANTIGUOS
        state.servicios = state.servicios.map(servicio =>
            servicio._id === _id ? { ...servicio, ...datosActualizados } : servicio
        );

        renderServicios(); // 🔥 Refrescar la UI con los datos correctos

        return true;
    } catch (error) {
        console.error("🚨 Error al actualizar el servicio:", error);
        return false;
    }
}



  
  // 📌 Función para eliminar un servicio
  /**
   * @param {any} _id
   */
  async function eliminarServicio(_id) {
    try {
      console.log(`📌 Eliminando servicio con _id ${_id}...`);
  
      if (!_id || _id.length !== 24) {
        console.error("❌ ERROR: ID inválido para MongoDB:", _id);
        return;
      }
  
      const response = await fetch(`http://${location.hostname}:${API_PORT}/delete/servicios/${_id}`, {
        method: "DELETE",
      });
  
      if (!response.ok) throw new Error(`Error en la eliminación: ${response.statusText}`);
  
      console.log(`✅ Servicio con _id ${_id} eliminado correctamente.`);
      await cargarServicios(); // Recargar la UI después de eliminar
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
      /** @type {Array<{ _id: string, nombre: string, descripcion: string, ubicacion: string, valoracion: string, imagen: string, categoria: string }>} */
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
      usuarioId: usuario ? usuario._id : null,
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
  

  // 📌 Cargar servicios al inicio
  cargarServicios();
});