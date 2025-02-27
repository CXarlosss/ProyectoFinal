import { importTemplate } from "../../../lib/importTemplate.js";

console.log("📌 CartaSERV.js cargado correctamente.");

// 📌 Configuración del template
const TEMPLATE = {
  id: "carta-serv-container-template",
  url: "../../javascript/components/CartaSERV/CartaSERV.html",
};

// 📌 Función para importar y definir el componente
async function loadAndDefineComponent() {
  try {
    await importTemplate(TEMPLATE.url);
  } catch (error) {
    console.error("❌ Error al importar el template:", error);
    return;
  }

  let checkInterval = setInterval(() => {
    let template = document.body.querySelector(`#${TEMPLATE.id}`);

    if (template) {
      clearInterval(checkInterval);

      if (!customElements.get("carta-serv")) {
        customElements.define("carta-serv", CartaSERV);
      } else {
        console.warn("⚠️ El elemento <carta-serv> ya está definido. Omitiendo redefinición.");
      }
    }
  }, 100);
}

// 📌 Llamar la función para cargar y definir el componente
loadAndDefineComponent();

export class CartaSERV extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._servicios = [];
  }

  set servicios(value) {
    console.log("📡 Recibiendo servicios en `<carta-serv>`:", value);
    this._servicios = value;
    this.render();
  }

  get servicios() {
    return this._servicios;
  }

  connectedCallback() {
    this._loadTemplate();
    this._addEventListeners();

    // 🚀 Agregar listener para actualizar servicios cuando se cree uno nuevo
    document.addEventListener("servicio-creado", async (event) => {
      // @ts-ignore
      console.log("📡 Evento 'servicio-creado' capturado en CartaSERV:", event.detail);
      
      // Asegurar que los datos tienen un ID
      // @ts-ignore
      if (!event.detail || !event.detail._id) {
          console.warn("⚠️ Servicio creado sin ID, posible error en la API.");
          return;
      }
  
      await cargarServicios();
  });
}  

  async _loadTemplate() {
    console.log("⏳ Cargando template para `<carta-serv>`...");

    const template = document.body.querySelector("#carta-serv-container-template");

    if (!template) {
      console.error("❌ No se encontró el template en el DOM.");
      return;
    }

    // 🚀 Reemplazar contenido con el template
    // @ts-ignore
    this.shadowRoot?.replaceChildren(template.content.cloneNode(true));

    // 🕐 Esperar hasta que `#servicios-container` esté disponible
    setTimeout(() => {
      const container = this.shadowRoot?.querySelector("#servicios-container");
      if (!container) {
        console.error("❌ ERROR: `#servicios-container` sigue sin existir en el DOM.");
      } else {
        console.log("✅ `#servicios-container` encontrado en `<carta-serv>`.");
      }
    }, 100);
  }

  _addEventListeners() {
    console.log("🎯 Agregando eventos de búsqueda y filtrado en `<carta-serv>`...");

    document.addEventListener("buscar-servicios", (event) => {
      // @ts-ignore
      const { busqueda } = event.detail;
      this.filtrarServicios(busqueda);
    });

    document.addEventListener("filtrar-actividades", () => {
      this.filtrarPorCategoria("actividad");
    });

    document.addEventListener("filtrar-comercios", () => {
      this.filtrarPorCategoria("comercio");
    });

    document.addEventListener("mostrar-todos", () => {
      this.render();
    });
  }

  /**
   * 🔎 Filtra los servicios basándose en el término de búsqueda.
   * @param {string} busqueda
   */
  filtrarServicios(busqueda) {
    if (!busqueda || busqueda.trim() === "") {
      this.render();
      return;
    }

    console.log(`📡 Buscando servicios con el término: "${busqueda}"`);

    const normalizeText = (text) => text?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() || "";

    const serviciosFiltrados = this._servicios.filter((servicio) =>
      normalizeText(servicio.nombre).includes(normalizeText(busqueda)) ||
      normalizeText(servicio.descripcion).includes(normalizeText(busqueda)) ||
      normalizeText(servicio.ubicacion).includes(normalizeText(busqueda))
    );

    console.log("🔍 Servicios filtrados:", serviciosFiltrados);
    this.render(serviciosFiltrados);
  }

  /**
   * 🔍 Filtra los servicios por categoría (actividad o comercio).
   * @param {string} categoria
   */
  filtrarPorCategoria(categoria) {
    console.log(`📡 Filtrando por categoría: ${categoria}`);
    const serviciosFiltrados = this._servicios.filter(servicio => servicio.categoria === categoria);
    this.render(serviciosFiltrados);
  }

  /**
   * 📌 Renderiza los servicios en el DOM.
   * @param {Array<any>} [servicios=this._servicios]
   */
  render(servicios = this._servicios) {
    console.log("📌 Intentando renderizar servicios...");

    const container = document.querySelector("#servicios-container");

    if (!container) {
      console.error("❌ No se encontró `#servicios-container` en el DOM. Reintentando en 100ms...");
      setTimeout(() => this.render(servicios), 100);
      return;
    }

    container.innerHTML = ""; 

    if (!servicios.length) {
      console.warn("⚠️ No hay servicios para mostrar.");
      return;
    }

    // 🔥 ACTUALIZAR `CartaSERV`
    const cartaServContainer = document.querySelector("#servicios-container");

    if (!cartaServContainer) {
      console.error("❌ No se encontró `#servicios-container` en el DOM.");
      return;
    }

    // 📌 Limpiar el contenedor antes de agregar nuevas tarjetas
    cartaServContainer.innerHTML = "";
    const serviciosLimitados = servicios.slice(0, 10);

    serviciosLimitados.forEach(servicio => {
      const cartaServicio = document.createElement("carta-servicio");
      cartaServicio.setAttribute("_id", servicio._id || "SIN_ID");
      cartaServicio.setAttribute("nombre", servicio.nombre);
      cartaServicio.setAttribute("descripcion", servicio.descripcion);
      cartaServicio.setAttribute("ubicacion", servicio.ubicacion);
      cartaServicio.setAttribute("valoracion", servicio.valoracion);
      cartaServicio.setAttribute("imagen", servicio.imagen);

      if (servicio.emailUsuario) {
        cartaServicio.setAttribute("emailUsuario", servicio.emailUsuario);
      }

      container.appendChild(cartaServicio);
    });

    console.log(`✅ Se han agregado ${servicios.length} servicios a <carta-serv>.`);
  }
}

// 📌 Función para obtener servicios de la API
async function cargarServicios() {
  try {
    const API_PORT = location.port ? `:${location.port}` : "";
    const response = await fetch(`${location.protocol}//${location.hostname}${API_PORT}/read/servicios`);
    const servicios = await response.json();

    console.log("📡 Servicios obtenidos después de actualizar:", servicios);

    if (!Array.isArray(servicios)) {
      throw new Error("⚠️ La API no devolvió un array válido de servicios.");
    }
    // 🔥 ACTUALIZAR `CartaSERV`
    const cartaServ = document.querySelector("carta-serv");
    if (cartaServ) {
      // @ts-ignore
      cartaServ.servicios = servicios.slice(0, 10);
    }

  } catch (error) {
    console.error("❌ Error al obtener servicios:", error);
  }
}
cargarServicios();

