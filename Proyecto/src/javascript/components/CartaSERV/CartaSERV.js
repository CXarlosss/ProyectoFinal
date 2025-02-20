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
        console.warn("⚠️ El elemento <carta-serv> ya está definido. Omitiendo redefinición.")
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
  }

  async _loadTemplate() {
    const template = document.body.querySelector("#carta-serv-container-template");

    if (!template) {
      console.error("❌ No se encontró el template en el DOM.");
      return;
    }

    // @ts-ignore
    this.shadowRoot?.replaceChildren(template.content.cloneNode(true));
    console.log("✅ Template cargado en `<carta-serv>`.");
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
      this.render(); // Volver a mostrar todos
    });
  }

  /**
   * 🔎 Filtra los servicios basándose en el término de búsqueda.
   * @param {string} busqueda
   */
  filtrarServicios(busqueda) {
    if (!busqueda || busqueda.trim() === "") {
      this.render(); // Si el término está vacío, mostrar todos los servicios
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
    console.log("📌 Renderizando servicios...");

    const container = this.shadowRoot?.querySelector("#servicios-container");
    if (!container) {
      console.error("❌ No se encontró `#servicios-container` dentro de `<carta-serv>`.");
      return;
    }

    container.innerHTML = ""; // ❗❗❗ Limpiar antes de agregar nuevos elementos

    if (!servicios.length) {
      console.warn("⚠️ No hay servicios para mostrar en `<carta-serv>`.");
      return;
    }

    servicios.forEach(servicio => {
      const servicioElement = document.createElement("carta-servicio");
      servicioElement.setAttribute("nombre", servicio.nombre);
      servicioElement.setAttribute("descripcion", servicio.descripcion);
      servicioElement.setAttribute("ubicacion", servicio.ubicacion);
      servicioElement.setAttribute("valoracion", servicio.valoracion);
      servicioElement.setAttribute("imagen", servicio.imagen);

      if (servicio.emailUsuario) {
        servicioElement.setAttribute("emailUsuario", servicio.emailUsuario);
      }

      container.appendChild(servicioElement);
    });

    console.log(`✅ Se han agregado ${servicios.length} servicios a <carta-serv>.`);
  }
}
