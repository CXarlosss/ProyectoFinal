// @ts-check

// @ts-check

document.addEventListener("DOMContentLoaded", () => {
  console.log("📌 DOM cargado correctamente.");

  // 📌 Configuración de la API
  const API_PORT = location.port ? `:${location.port}` : "";

  let serviciosContainer =/** @type {HTMLDivElement | null} */ document.getElementById(  "servicios-container");
  const modalCrearServicio =/** @type {HTMLDivElement | null} */ document.getElementById(  "modal-crear-servicio");
  const formCrearServicio =/** @type {HTMLFormElement | null} */ document.getElementById("crear-servicio-form");
  const btnCerrarModal =/** @type {HTMLButtonElement | null} */ document.getElementById( "btn-cerrar-modal" );
    // 📌 Esperar que el contenedor `#servicios-container` esté disponible
    async function esperarContenedorServicios() {
      let intentos = 0;
      const maxIntentos = 10;

      return new Promise((resolve, reject) => {
        const intervalo = setInterval(() => {
          serviciosContainer = document.getElementById("servicios-container");

          if (serviciosContainer) {
            clearInterval(intervalo);
            console.log("✅ `#servicios-container` encontrado en el DOM.");
            resolve(true);
          } else if (intentos >= maxIntentos) {
            clearInterval(intervalo);
            console.error("❌ No se encontró `#servicios-container` después de varios intentos.");
            reject(false);
          }

          intentos++;
        }, 300);
      });
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
    favoritos: []
};

// Luego dentro de `iniciarApp()`




async function cargarServicios() {
  try {
      const serviciosAPI = await fetch(`${location.protocol}//${location.hostname}${API_PORT}/read/servicios`);
      const servicios = await serviciosAPI.json();

      console.log("📌 Servicios obtenidos después de actualizar:", servicios);

      if (!Array.isArray(servicios)) throw new Error("⚠️ La API no devolvió un array válido de servicios.");

      // ✅ Guardar en `state.servicios`
      state.servicios = servicios;

      // ✅ Hacer `state` accesible globalmente
      // @ts-ignore
      window.state = state;

      // ✅ Disparar evento para que `CartaSERV` reciba los servicios
      document.dispatchEvent(new CustomEvent("servicios-cargados", { detail: { servicios } }));

  } catch (error) {
      console.error("❌ Error al obtener servicios:", error);
  }
}


// 📌 Renderizar servicios en el DOM
  /**
   * @param {any[]} servicios
   */
  function renderServicios(servicios) {
    console.log("📌 Renderizando servicios...");

    const serviciosContainer = document.getElementById("servicios-container");
    if (!serviciosContainer) {
      console.error("❌ No se encontró `#servicios-container` en el DOM.");
      return;
    }

    // Limpiar contenido previo antes de agregar nuevos servicios
    serviciosContainer.innerHTML = "";

    servicios.forEach((servicio) => {
      const cartaServicio = document.createElement("carta-servicio");
      cartaServicio.setAttribute("_id", servicio._id); // ✅ PASAR ID AQUÍ
      cartaServicio.setAttribute("nombre", servicio.nombre);
      cartaServicio.setAttribute("descripcion", servicio.descripcion);
      cartaServicio.setAttribute("ubicacion", servicio.ubicacion);
      cartaServicio.setAttribute("valoracion", servicio.valoracion);
      cartaServicio.setAttribute("imagen", servicio.imagen);
      cartaServicio.setAttribute("emailUsuario", servicio.emailUsuario);

      console.log(`✅ Asignando servicio con ID: ${servicio._id}`); // Debugging

      serviciosContainer.appendChild(cartaServicio);
    });

    console.log("✅ Servicios renderizados correctamente.");
  }

// Eventos del buscador
document.addEventListener("buscar-servicios", (event) => {
  // ✅ Esperar hasta que `state.servicios` tenga datos
  if (!state.servicios || state.servicios.length === 0) {
      console.warn("⚠️ No hay servicios cargados todavía. Esperando...");
      return;
  }

  // @ts-ignore
  const { busqueda } = event.detail;
  console.log("📡 Evento 'buscar-servicios' capturado:", busqueda);

  const serviciosFiltrados = state.servicios.filter(servicio =>
      servicio.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      servicio.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
      servicio.ubicacion.toLowerCase().includes(busqueda.toLowerCase())
  );

  console.log("🔍 Servicios filtrados:", serviciosFiltrados);
  renderServicios(serviciosFiltrados);
});



  document.addEventListener("filtrar-actividades", () => {
    console.log("📡 Evento 'filtrar-actividades' capturado.");
    const filtrados = state.servicios.filter(
      (servicio) => servicio.categoria === "actividad"
    );
    renderServicios(filtrados);
  });

  document.addEventListener("filtrar-comercios", () => {
    console.log("📡 Evento 'filtrar-comercios' capturado.");
    const filtrados = state.servicios.filter(
      (servicio) => servicio.categoria === "comercio"
    );
    renderServicios(filtrados);
  });

  document.addEventListener("mostrar-todos", () => {
    console.log("📡 Evento 'mostrar-todos' capturado.");
    renderServicios(state.servicios);
  });

  document.addEventListener("crear-servicio", () => {
    console.log("📡 Evento 'crear-servicio' capturado.");
    modalCrearServicio?.classList.remove("hidden");
  });

  btnCerrarModal?.addEventListener("click", () => {
    modalCrearServicio?.classList.add("hidden");
  });

  document.addEventListener("servicios-cargados", (event) => {
    // @ts-ignore
    console.log(
      "📡 Evento 'servicios-cargados' recibido con servicios:",
      // @ts-ignore
      event.detail.servicios
    );

    let intentos = 0;
    const intervalo = setInterval(() => {
      const cartaServ = document.querySelector("carta-serv");

      if (cartaServ) {
        console.log("✅ <carta-serv> encontrado, asignando servicios...");

        if ("servicios" in cartaServ) {
          // @ts-ignore
          cartaServ.servicios = event.detail.servicios;
          console.log(
            "✅ Servicios asignados correctamente a `<carta-serv>`:",
            cartaServ.servicios
          );
        } else {
          console.error(
            "❌ `<carta-serv>` no tiene una propiedad 'servicios'."
          );
        }

        clearInterval(intervalo);
      } else if (intentos >= 10) {
        console.error(
          "❌ No se pudo encontrar `<carta-serv>` después de varios intentos."
        );
        clearInterval(intervalo);
      }
      intentos++;
    }, 300);
  });



  /// 📌 Cargar servicios después de esperar el contenedor
   esperarContenedorServicios();
  cargarServicios();




  serviciosContainer?.addEventListener("click", async (e) => {
    const target = /** @type {HTMLElement} */ (e.target);
    if (!target) return;
    console.log("🛠 Clic detectado en:", target); //  Debugging
    if (target.classList.contains("btn-detalles")) {
      const _id = target.getAttribute("data-_id");
      console.log("📌 _id del servicio seleccionado:", _id);

      if (_id) {
        window.location.href = `serviciosin.html?_id=${encodeURIComponent(
          _id
        )}`;
      } else {
        console.error("❌ Error: No se encontró el _id del servicio.");
      }
    }

    // 📌 Añadir a Favoritos
    if (target.classList.contains("btn-favorito")) {
      const _id = target.getAttribute("data-_id");
      const nombre = target.getAttribute("data-nombre");

      if (_id && nombre) {
        // ✅ Asegurar que no son null
        toggleFavorito(_id, nombre);
      } else {
        console.error(
          "🚨 Error: _id o nombre inválido en el botón de favoritos."
        );
      }
      console.log("📌 _id del servicio a editar:", _id);
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

      const confirmacion = confirm(
        "¿Estás seguro de que quieres eliminar este servicio?"
      );
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
  /**
   * 📌 Añadir o quitar un servicio de favoritos en la base de datos
   * @param {string} servicioId
   * @param {string} nombre
   */
  async function toggleFavorito(servicioId, nombre) {
    try {
      if (!usuario || !usuario._id) {
        console.error("❌ Error: Usuario no autenticado.");
        return;
      }

      console.log(
        `📌 Enviando petición para actualizar favoritos del usuario ${usuario._id}`
      );

      const response = await fetch(
        `${location.protocol}//${location.hostname}${API_PORT}/api/users/${usuario._id}/favoritos/${servicioId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("✅ Respuesta de la API:", data);

      // Actualizar estado local
      const index = state.favoritos.findIndex((fav) => fav._id === servicioId);
      if (index !== -1) {
        state.favoritos.splice(index, 1); // ❌ Quitar si ya estaba en favoritos
      } else {
        state.favoritos.push({ _id: servicioId, nombre }); // ✅ Añadir si no estaba
      }


    } catch (error) {
      console.error("🚨 Error al actualizar favoritos:", error);
    }
    guardarFavoritos();
  }

  function guardarFavoritos() {
    localStorage.setItem(
      `favoritos_${usuario._id}`,
      JSON.stringify(state.favoritos)
    );
    cargarFavoritos
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

      console.log(
        `📌 Enviando actualización para el servicio con _id ${_id}:`,
        datosActualizados
      );

      // 🚀 Eliminar `_id` de los datos antes de enviarlos
      if (datosActualizados._id) {
        delete datosActualizados._id;
      }

      const response = await fetch(
        `${location.protocol}//${location.hostname}${API_PORT}/api/update/servicios/${_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datosActualizados),
        }
      );

      if (!response.ok) {
        throw new Error(`Error en la actualización: ${response.statusText}`);
      }

      const resultado = await response.json();

      console.log(
        `✅ Servicio con _id ${_id} actualizado correctamente.`,
        resultado
      );

      // 🚀 ACTUALIZAR `state.servicios` PARA EVITAR DATOS ANTIGUOS
      state.servicios = state.servicios.map((servicio) =>
        servicio._id === _id ? { ...servicio, ...datosActualizados } : servicio
      );

      

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

      const response = await fetch(
        `${location.protocol}//${location.hostname}${API_PORT}/api/delete/servicios/${_id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok)
        throw new Error(`Error en la eliminación: ${response.statusText}`);

      console.log(`✅ Servicio con _id ${_id} eliminado correctamente.`);
      await cargarServicios(); // Recargar la UI después de eliminar
    } catch (error) {
      console.error("🚨 Error al eliminar el servicio:", error);
    }
  }
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
        /** @type {HTMLInputElement} */ (
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
        /** @type {HTMLInputElement} */ (
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
      emailUsuario: usuario ? usuario.email : null,
    };

    try {
      console.log("📌 Enviando nuevo servicio a la API:", nuevoServicio);

      const response = await fetch(
        `${location.protocol}//${location.hostname}${API_PORT}/api/create/servicios`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Enviar como JSON
          },
          body: JSON.stringify(nuevoServicio), // Convertir a JSON
        }
      );

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
  });

  // 📌 Cargar servicios al inicio
  cargarServicios();
});
