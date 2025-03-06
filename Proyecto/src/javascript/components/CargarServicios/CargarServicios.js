// @ts-check
import { importTemplate } from "../../../lib/importTemplate.js";

// 📌 Configuración del template
const TEMPLATE = {
  id: "cargar-servicios-template",
  url: "../../javascript/components/CargarServicios/CargarServicios.html",
};

// 📌 Función para importar y definir el componente
async function loadAndDefineComponent() {
  try {
    await importTemplate(TEMPLATE.url);
  } catch (error) {
    console.error("❌ Error al importar el template:", error);
    return;
  }

  // Esperar a que el template esté en el DOM antes de definir el componente
  const checkInterval = setInterval(() => {
    const template = document.body.querySelector(`#${TEMPLATE.id}`);

    if (template) {
      clearInterval(checkInterval);
      console.log("✅ Template encontrado en el DOM.");

      if (!customElements.get("cargar-servicios")) {
        console.log("🆕 Definiendo <cargar-servicios> como Web Component...");
        customElements.define("cargar-servicios", CargarServicios);
      } else {
        console.warn("⚠️ El elemento <cargar-servicios> ya está definido.");
      }
    }
  }, 100);
}

// 📌 Llamar la función para cargar y definir el componente
loadAndDefineComponent();

// 📌 Web Component <cargar-servicios>
export class CargarServicios extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  get template() {
    return document.body.querySelector(`#${TEMPLATE.id}`);
  }

  connectedCallback() {
    this._loadTemplate();
    this.cargarServicios(); // 🚀 Cargar servicios al conectar el componente al DOM
  }

  _loadTemplate() {
    const template = this.template;
    if (!template || !this.shadowRoot) {
      return;
    }

    // @ts-ignore
    const clone = template.content.cloneNode(true);
    this.shadowRoot.replaceChildren(clone);

    // ✅ Importar el CSS externo
    const linkElement = document.createElement("link");
    linkElement.rel = "stylesheet";
    linkElement.href = "../../css/styles-servicios.css";
    this.shadowRoot.appendChild(linkElement);

    // ✅ Añadir eventos a los botones
    this._addEventListeners();
  }

  _addEventListeners() {
    const btnCargar = this.shadowRoot?.querySelector("#btn-cargar-servicios");
    const estadoCarga = this.shadowRoot?.querySelector("#estado-carga");

    if (!btnCargar || !estadoCarga) {
      console.error("❌ No se encontraron los elementos del botón o el estado de carga.");
      return;
    }

    btnCargar.addEventListener("click", async () => {
      estadoCarga.textContent = "🔄 Cargando servicios...";
      await this.cargarServicios();
    });
  }

  async cargarServicios() {
    try {
      const API_PORT = location.port ? `:${location.port}` : "";
     
      const response = await fetch(`${location.protocol}//${location.hostname}${API_PORT}/api/read/servicios`);
      const servicios = await response.json();

      console.log("📡 Servicios obtenidos después de actualizar:", servicios);

      if (!Array.isArray(servicios)) {
        throw new Error("⚠️ La API no devolvió un array válido de servicios.");
      }
      const serviciosLimitados = servicios.slice(0, 10);
      // 🔥 ACTUALIZAR `CartaSERV`
      const cartaServ = document.querySelector("carta-serv");
      if (cartaServ) {
        // @ts-ignore
        cartaServ.servicios = serviciosLimitados;
      } else {
        console.error("❌ No se encontró `<carta-serv>` en el DOM.");
      }

      if (this.shadowRoot) {
        // @ts-ignore
        this.shadowRoot.querySelector("#estado-carga").textContent = "✅ Servicios cargados correctamente.";
      }

    } catch (error) {
      console.error("❌ Error al obtener servicios:", error);
      if (this.shadowRoot) {
        // @ts-ignore
        this.shadowRoot.querySelector("#estado-carga").textContent = "❌ Error al cargar los servicios. Ver consola para detalles.";
      }
    }
  }
}

// ✅ Escuchar evento para actualizar la lista cuando se cree un servicio
document.addEventListener("actualizar-lista-servicios", () => {
  console.log("📡 Evento 'actualizar-lista-servicios' capturado. Recargando...");
  const cargarServiciosComponent = document.querySelector("cargar-servicios");
  if (cargarServiciosComponent) {
    // @ts-ignore
    cargarServiciosComponent.cargarServicios();
  }
});
