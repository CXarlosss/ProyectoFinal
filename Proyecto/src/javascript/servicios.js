// @ts-check

document.addEventListener("DOMContentLoaded", () => {
  console.log("📌 DOM cargado correctamente.");

  // 📌 Configuración de la API
  const API_PORT = location.port ? `:${location.port}` : "";
  
  esperarContenedorServicios()
  cargarServicios();
  let serviciosContainer =
    /** @type {HTMLDivElement | null} */ document.getElementById(
      "servicios-container"
    );
  const modalCrearServicio =
    /** @type {HTMLDivElement | null} */ document.getElementById(
      "modal-crear-servicio"
    );
  
  const btnCerrarModal =
    /** @type {HTMLButtonElement | null} */ document.getElementById(
      "btn-cerrar-modal"
    );
    const formCrearServicio = /** @type {HTMLButtonElement | null} */ document.getElementById("crear-servicio-form");

    if (!modalCrearServicio || !formCrearServicio) {
      console.error("❌ No se encontró el modal o formulario de creación de servicios.");
      return;
    }
  
    // Evento para mostrar modal
   
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
          console.error(
            "❌ No se encontró `#servicios-container` después de varios intentos."
          );
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

  /** @type {{ servicios: { _id: string, nombre: string, descripcion: string, ubicacion: string, imagen: string, categoria: string }[], favoritos: { _id: string, nombre: string }[] }} */

  const state = {
    servicios: [],
    favoritos: [],
  };


  // @ts-ignore
  document.addEventListener("favoritos-actualizados", ({ detail: { servicioId, esFavorito } }) => {
    console.log("📌 Evento 'favoritos-actualizados' recibido en servicios.js. Actualizando botones...");

    // Buscar el botón correspondiente en la UI y actualizarlo
    document.querySelectorAll(`.btn-favorito[data-servicio-id="${servicioId}"]`).forEach(btn => {
      btn.textContent = esFavorito ? "★ Quitar de Favoritos" : "☆ Añadir a Favoritos";
      btn.classList.toggle("favorito", esFavorito);
    });
});


async function cargarServicios() {
  try {
      const serviciosAPI = await fetch(`${location.protocol}//${location.hostname}${API_PORT}/read/servicios`);
      const servicios = await serviciosAPI.json();

      console.log("📌 Servicios obtenidos después de actualizar:", servicios);

      if (!Array.isArray(servicios))
          throw new Error("⚠️ La API no devolvió un array válido de servicios.");

      // 🔥 Obtener favoritos desde localStorage
      const usuarioGuardado = localStorage.getItem("usuarioRegistrado");
      const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
      const favoritos = usuario ? JSON.parse(localStorage.getItem(`favoritos_${usuario._id}`) || "[]") : [];

      // 🔥 Marcar los servicios como favoritos si están en la lista
      const serviciosConFavoritos = servicios.map(servicio => ({
          ...servicio,
          esFavorito: favoritos.some(fav => fav._id === servicio._id)
      }));

      state.servicios = serviciosConFavoritos;

      // ✅ Hacer `state` accesible globalmente
      // @ts-ignore
      window.state = state;

      // ✅ Disparar evento para que `CartaSERV` reciba los servicios
      document.dispatchEvent(
          new CustomEvent("servicios-cargados", { detail: { servicios: serviciosConFavoritos } })
      );

      renderServicios(serviciosConFavoritos.slice(0, 10));
      agregarBotonCargarMas();
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

    // ❗❗❗ LIMPIAR EL CONTENEDOR ANTES DE RENDERIZAR ❗❗❗
    serviciosContainer.innerHTML = "";

    servicios.forEach((servicio) => {
      const cartaServicio = document.createElement("carta-servicio");
      cartaServicio.setAttribute("_id", servicio._id);
      cartaServicio.setAttribute("nombre", servicio.nombre);
      cartaServicio.setAttribute("descripcion", servicio.descripcion);
      cartaServicio.setAttribute("ubicacion", servicio.ubicacion);

      cartaServicio.setAttribute("imagen", servicio.imagen);
      cartaServicio.setAttribute("emailUsuario", servicio.emailUsuario);

      console.log(`✅ Asignando servicio con ID: ${servicio._id}`);

      serviciosContainer.appendChild(cartaServicio);
    });

    console.log("✅ Servicios renderizados correctamente.");
  }

  // Eventos del buscador
  document.addEventListener("buscar-servicios", (event) => {
    // @ts-ignore
    console.log("📡 Evento 'buscar-servicios' detectado en servicios.js:", event.detail);
  
    if (!state.servicios || state.servicios.length === 0) {
      console.warn("⚠️ No hay servicios cargados todavía. Esperando...");
      return;
    }
  
    // @ts-ignore
    const { busqueda } = event.detail;
    console.log("📡 Buscando servicios con el término:", busqueda);
  
    const serviciosFiltrados = state.servicios.filter(
      (servicio) =>
        servicio.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        servicio.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
        servicio.ubicacion.toLowerCase().includes(busqueda.toLowerCase())
    );
  
    console.log("🔍 Servicios filtrados encontrados:", serviciosFiltrados);
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

   
   
   
  });

   // Manejo de envío del formulario
   formCrearServicio.addEventListener("submit", async (event) => {
    event.preventDefault();
    console.log("📡 Intentando crear un servicio...");

    const usuarioGuardado = localStorage.getItem("usuarioRegistrado");
    if (!usuarioGuardado) {
      alert("⚠️ No estás autenticado. Inicia sesión para crear un servicio.");
      return;
    }
    const usuario = JSON.parse(usuarioGuardado);

    const nuevoServicio = {
      // @ts-ignore
      nombre: formCrearServicio.querySelector("#nombre-servicio").value.trim(),
      // @ts-ignore
      descripcion: formCrearServicio.querySelector("#descripcion-servicio").value.trim(),
      // @ts-ignore
      ubicacion: formCrearServicio.querySelector("#ubicacion-servicio").value.trim(),
      
      // @ts-ignore
      precio: parseFloat(formCrearServicio.querySelector("#precio-servicio").value) || 0,
      // @ts-ignore
      metodoPago: formCrearServicio.querySelector("#metodo-pago-servicio").value.trim(),
      // @ts-ignore
      etiquetas: formCrearServicio.querySelector("#etiquetas-servicio").value.split(",").map(tag => tag.trim()).filter(Boolean),
      usuarioId: usuario._id,
      emailUsuario: usuario.email,
    };

    console.log("📋 Datos listos para enviar:", nuevoServicio);

    if (!nuevoServicio.nombre || !nuevoServicio.descripcion || !nuevoServicio.ubicacion) {
      alert("⚠️ Todos los campos obligatorios deben estar llenos.");
      return;
    }

    try {
      const response = await fetch(`${location.protocol}//${location.hostname}${API_PORT}/create/servicios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoServicio),
      });

      if (!response.ok) {
        throw new Error(`❌ Error en la solicitud: ${response.statusText}`);
      }

      const apiData = await response.json();
      console.log("✅ Servicio creado correctamente:", apiData);
      alert("✅ Servicio creado con éxito");

      document.dispatchEvent(new CustomEvent("servicio-creado", { detail: apiData }));
      
      // @ts-ignore
      formCrearServicio.reset();
      modalCrearServicio.classList.add("hidden");
    } catch (error) {
      console.error("❌ Error al crear servicio:", error);
      alert("❌ Hubo un error al crear el servicio.");
    }
  });
  cargarServicios();

function agregarBotonCargarMas() {
  let botonCargarMas = document.getElementById("btn-cargar-mas");
  
  // Si ya existe el botón, no lo agregamos de nuevo
  if (botonCargarMas) return;

  botonCargarMas = document.createElement("button");
  botonCargarMas.id = "btn-cargar-mas";
  botonCargarMas.textContent = "Cargar más";
  botonCargarMas.style.display = "block";
  botonCargarMas.style.margin = "5px auto";
  botonCargarMas.style.padding = "10px 15px";
  botonCargarMas.style.cursor = "pointer";

  // Agregar evento para mostrar más servicios
  let cantidadMostrada = 10;
  botonCargarMas.addEventListener("click", () => {
    cantidadMostrada += 10;
    renderServicios(state.servicios.slice(0, cantidadMostrada));

    // Si ya se mostraron todos, ocultar el botón
    if (cantidadMostrada >= state.servicios.length) {
      botonCargarMas.style.display = "none";
    }
  });

  document.body.appendChild(botonCargarMas);
}
});
 
  
  
 


// @ts-ignore

