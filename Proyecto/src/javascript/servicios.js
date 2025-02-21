// @ts-check



// @ts-check

document.addEventListener("DOMContentLoaded", () => {
  console.log("📌 DOM cargado correctamente.");

  // 📌 Configuración de la API
  const API_PORT = location.port ? `:${location.port}` : "";

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

  /** @type {{ servicios: { _id: string, nombre: string, descripcion: string, ubicacion: string, valoracion: string, imagen: string, categoria: string }[], favoritos: { _id: string, nombre: string }[] }} */

  const state = {
    servicios: [],
    favoritos: [],
  };

  // Luego dentro de `iniciarApp()`

  async function cargarServicios() {
    try {
      const serviciosAPI = await fetch(
        `${location.protocol}//${location.hostname}${API_PORT}/read/servicios`
      );
      const servicios = await serviciosAPI.json();

      console.log("📌 Servicios obtenidos después de actualizar:", servicios);

      if (!Array.isArray(servicios))
        throw new Error("⚠️ La API no devolvió un array válido de servicios.");

      // ✅ Guardar en `state.servicios`
      state.servicios = servicios;

      // ✅ Hacer `state` accesible globalmente
      // @ts-ignore
      window.state = state;

      // ✅ Disparar evento para que `CartaSERV` reciba los servicios
      document.dispatchEvent(
        new CustomEvent("servicios-cargados", { detail: { servicios } })
      );
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
      cartaServicio.setAttribute("valoracion", servicio.valoracion);
      cartaServicio.setAttribute("imagen", servicio.imagen);
      cartaServicio.setAttribute("emailUsuario", servicio.emailUsuario);

      console.log(`✅ Asignando servicio con ID: ${servicio._id}`);

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

    const serviciosFiltrados = state.servicios.filter(
      (servicio) =>
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
  
 





 
  // 📌 Crear nuevo servicio desde el formulario
 

});
