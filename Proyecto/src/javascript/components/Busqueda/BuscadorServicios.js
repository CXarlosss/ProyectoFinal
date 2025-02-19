import { importTemplate } from "../../../lib/importTemplate.js";

console.log("📌 BuscadorServicios.js cargado correctamente.");

// 📌 Configuración del template
const TEMPLATE = {
  id: "buscador-template",
  url: "../../javascript/components/Busqueda/BuscadorServicios.html",
};

// 📌 Función para cargar y definir el componente
async function loadAndDefineComponent() {
  console.log("⏳ Intentando importar template desde:", TEMPLATE.url);
  
  try {
    await importTemplate(TEMPLATE.url);
    console.log("✅ Template importado correctamente.");
  } catch (error) {
    console.error("❌ Error al importar el template:", error);
    return;
  }

  let template = document.body.querySelector(`#${TEMPLATE.id}`);
  console.log("🔍 Buscando template en el DOM:", template);

  if (!template) {
    console.error("❌ El template no se encontró en el DOM. Asegúrate de que BuscadorServicios.html está bien ubicado.");
    return;
  }

  // ✅ Solo registrar el custom element si aún no está definido
  if (!customElements.get("buscador-servicios")) {
    console.log("🆕 Definiendo <buscador-servicios> como Web Component...");
    customElements.define("buscador-servicios", BuscadorServicios);
  } else {
    console.warn("⚠️ El elemento <buscador-servicios> ya está definido. Omitiendo redefinición.");
  }
}

// 📌 Llamar la función para cargar y definir el componente
loadAndDefineComponent();

export class BuscadorServicios extends HTMLElement {
  constructor() {
    super();
    console.log("📌 Instancia de <buscador-servicios> creada.");
    this.attachShadow({ mode: "open" });
  }

  get template() {
    console.log("🔍 Intentando obtener template del DOM...");
    const template = document.body.querySelector(`#${TEMPLATE.id}`);
    
    if (!template) {
      console.error("❌ No se encontró el template en el DOM.");
    } else {
      console.log("✅ Template encontrado en el DOM.");
    }
    
    return template;
  }

  connectedCallback() {
    console.log("✅ <buscador-servicios> conectado al DOM.");

    if (!this.shadowRoot) {
      console.log("🛠 Creando Shadow DOM...");
      this.attachShadow({ mode: "open" });
    }

    this._loadTemplate();
  }

  _loadTemplate() {
    console.log("🛠 Cargando template dentro del componente...");
    
    const template = this.template;

    if (!template) {
      console.error("❌ No se pudo cargar el template en _loadTemplate. Asegúrate de que el template existe en el DOM.");
      return;
    }

    console.log("✅ Template clonado correctamente en el Shadow DOM.");
    // @ts-ignore
    this.shadowRoot?.replaceChildren(template.content.cloneNode(true));

    // ✅ Importar el CSS externo
    const linkElement = document.createElement("link");
    linkElement.rel = "stylesheet";
    linkElement.href = "../../css/styles-servicios.css"; // Ajusta la ruta según sea necesario
    this.shadowRoot?.appendChild(linkElement);
    console.log("🎨 CSS importado:", linkElement.href);

    this._addEventListeners();
  }

  _addEventListeners() {
    console.log("🎯 Añadiendo eventos a los botones...");

    const buscador = this.shadowRoot?.getElementById("buscador");
    const btnBuscar = this.shadowRoot?.getElementById("btn-buscador");

    if (!buscador) {
      console.error("❌ No se encontró el input de búsqueda en el Shadow DOM.");
    }

    if (!btnBuscar) {
      console.error("❌ No se encontró el botón de búsqueda en el Shadow DOM.");
    }

    btnBuscar?.addEventListener("click", this.buscarServicios.bind(this));
    this.shadowRoot?.getElementById("btn-filtrar-actividades")?.addEventListener("click", () =>
      this._dispatchEvent("filtrar-actividades")
    );
    this.shadowRoot?.getElementById("btn-filtrar-comercios")?.addEventListener("click", () =>
      this._dispatchEvent("filtrar-comercios")
    );
    this.shadowRoot?.getElementById("btn-mostrar-todos")?.addEventListener("click", () =>
      this._dispatchEvent("mostrar-todos")
    );
    this.shadowRoot?.getElementById("btn-crear-servicio")?.addEventListener("click", () =>
      this._dispatchEvent("crear-servicio")
    );

    console.log("✅ Eventos añadidos correctamente.");
  }

  buscarServicios() {
    console.log("🔎 Ejecutando búsqueda...");
  
    const inputBuscador = /** @type {HTMLInputElement | null} */ (this.shadowRoot?.getElementById("buscador"));
    const busqueda = inputBuscador ? inputBuscador.value.trim().toLowerCase() : "";

    console.log("📡 Buscando servicios con el término:", busqueda);

    this._dispatchEvent("buscar-servicios", { busqueda });
  }
  
  _dispatchEvent(eventName, detail = {}) {
    console.log(`📡 Disparando evento "${eventName}" con detalle:`, detail);
    this.dispatchEvent(new CustomEvent(eventName, { bubbles: true, composed: true, detail }));
  }
}


