// @ts-check
import { importTemplate } from "../../../lib/importTemplate.js";

console.log("📌 CartaServicios.js cargado correctamente.");

/**
 * @typedef {Object} Servicio
 * @property {string} _id
 * @property {string} nombre
 * @property {string} descripcion
 * @property {string} ubicacion
 * @property {string} valoracion
 * @property {string} imagen
 * @property {string} emailUsuario
 * @property {boolean} esFavorito
 * @property {boolean} esPropietario
 */

// 📌 Configuración del template
const TEMPLATE = {
  id: "carta-servicios-template",
  url: "../../javascript/components/CartaServicios/CartaServicios.html",
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

  // 🔥 Esperar hasta que el template realmente esté disponible en el DOM
  let checkInterval = setInterval(() => {
    let template = document.body.querySelector(`#${TEMPLATE.id}`);
    if (template) {
      clearInterval(checkInterval);
      console.log("✅ Template disponible en el DOM.");

      if (!customElements.get("carta-servicio")) {
        console.log("🆕 Definiendo <carta-servicio> como Web Component...");
        customElements.define("carta-servicio", CartaServicio);
      } else {
        console.warn("⚠️ El elemento <carta-servicio> ya está definido. Omitiendo redefinición.");
      }
    }
  }, 100);
}

// 📌 Llamar la función para cargar y definir el componente
loadAndDefineComponent();

class CartaServicio extends HTMLElement {
  constructor() {
    super();
    console.log("📌 Instancia de <carta-servicio> creada.");
    this.attachShadow({ mode: "open" });
  }

  /**
   * Obtiene el template del documento.
   * @returns {HTMLTemplateElement | null}
   */
  get template() {
    console.log("🔍 Intentando obtener template del DOM...");
    return /** @type {HTMLTemplateElement | null} */ (document.body.querySelector(`#${TEMPLATE.id}`));
  }

  connectedCallback() {
    console.log("✅ <carta-servicio> conectado al DOM.");

    if (!this.shadowRoot) {
      console.log("🛠 Creando Shadow DOM...");
      this.attachShadow({ mode: "open" });
    }

    // 🔥 Esperar hasta que el template esté disponible
    let checkTemplateInterval = setInterval(() => {
      const template = this.template;
      if (template) {
        clearInterval(checkTemplateInterval);
        console.log("✅ Template encontrado en el DOM.");
        this._loadTemplate();
      } else {
        console.warn("⏳ Aún esperando que el template aparezca...");
      }
    }, 100);
  }

  _loadTemplate() {
    console.log("🛠 Cargando template dentro del componente...");

    const template = this.template;
    if (!template || !this.shadowRoot) {
      console.error("❌ No se pudo cargar el template en _loadTemplate.");
      return;
    }

    console.log("✅ Template clonado correctamente en el Shadow DOM.");
    this.shadowRoot.replaceChildren(template.content.cloneNode(true));

    // ✅ Importar el CSS externo
    const linkElement = document.createElement("link");
    linkElement.rel = "stylesheet";
    linkElement.href = "../../css/styles-servicios.css"; // Ajusta la ruta según sea necesario
    this.shadowRoot.appendChild(linkElement);
    console.log("🎨 CSS importado:", linkElement.href);
  }

  /**
   * 📌 Asigna datos al componente carta-servicio.
   * @param {Servicio} data
   */
  set servicio(data) {
    console.log("🛠 Asignando datos al servicio:", data);

    if (!data || !this.shadowRoot) return;

    /** @type {HTMLImageElement | null} */
    const img = this.shadowRoot.querySelector(".card-img");
    /** @type {HTMLElement | null} */
    const nombre = this.shadowRoot.querySelector(".servicio-nombre");
    /** @type {HTMLElement | null} */
    const descripcion = this.shadowRoot.querySelector(".servicio-descripcion");
    /** @type {HTMLElement | null} */
    const ubicacion = this.shadowRoot.querySelector(".servicio-ubicacion");
    /** @type {HTMLElement | null} */
    const valoracion = this.shadowRoot.querySelector(".servicio-valoracion");

    if (img) {
      img.src = data.imagen || "default.jpg";
      img.alt = `Imagen de ${data.nombre || "Servicio"}`;
    }
    if (nombre) nombre.textContent = data.nombre || "Nombre no disponible";
    if (descripcion) descripcion.textContent = data.descripcion || "Descripción no disponible";
    if (ubicacion) ubicacion.textContent = data.ubicacion || "Ubicación no disponible";
    if (valoracion) valoracion.textContent = data.valoracion || "No valorado";
  }
}

customElements.define("carta-servicio", CartaServicio);
export { CartaServicio };
