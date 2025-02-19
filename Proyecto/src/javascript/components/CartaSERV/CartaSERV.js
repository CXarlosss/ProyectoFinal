// @ts-check
import { importTemplate } from "../../../lib/importTemplate.js";
import { CartaServicio } from "../CartaServicios/CartaServicios.js";
console.log("📌 CartaSERV.js cargado correctamente.");

// 📌 Configuración del template
const TEMPLATE = {
  id: "carta-serv-container-template",
  url: "../../javascript/components/CartaSERV/CartaSERV.html",
};

// 📌 Función para esperar y definir el componente
async function loadAndDefineComponent() {
  console.log("⏳ Intentando importar template desde:", TEMPLATE.url);

  try {
    await importTemplate(TEMPLATE.url);
    console.log("✅ Template importado correctamente.");
  } catch (error) {
    console.error("❌ Error al importar el template:", error);
    return;
  }

  let checkInterval = setInterval(() => {
    let template = document.body.querySelector(`#${TEMPLATE.id}`);

    if (template) {
      clearInterval(checkInterval);
      console.log("✅ Template encontrado en el DOM.");

      if (!customElements.get("carta-serv")) {
        console.log("🆕 Definiendo <carta-serv> como Web Component...");
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
    console.log("📌 Instancia de <carta-serv> creada.");
    this.attachShadow({ mode: "open" });
  }

  get template() {
    return document.body.querySelector(`#${TEMPLATE.id}`);
  }

  connectedCallback() {
    console.log("✅ <carta-serv> conectado al DOM.");

    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
    }

    this._loadTemplate();
  }

  _loadTemplate() {
    console.log("🛠 Cargando template dentro del componente...");

    const template = this.template;
    if (!template || !this.shadowRoot) {
      console.error("❌ No se pudo cargar el template en _loadTemplate.");
      return;
    }

    console.log("✅ Template clonado correctamente en el Shadow DOM.");
    // @ts-ignore
    this.shadowRoot.replaceChildren(template.content.cloneNode(true));

    // ✅ Importar el CSS externo
    const linkElement = document.createElement("link");
    linkElement.rel = "stylesheet";
    linkElement.href = "../../css/styles-servicios.css";
    this.shadowRoot.appendChild(linkElement);
    console.log("🎨 CSS importado:", linkElement.href);
  }

  /**
   * 📌 Recibe un array de servicios y los renderiza usando `CartaServicios`
   * @param {Array<{ _id: string, nombre: string, descripcion: string, ubicacion: string, valoracion: string, imagen: string, emailUsuario: string, esFavorito: boolean, esPropietario: boolean }>} servicios
   */
  set servicios(servicios) {
    console.log("🛠 Recibiendo servicios para renderizar:", servicios);

    if (!this.shadowRoot) return;

    const container = this.shadowRoot.querySelector("#servicios-container");
    if (!container) {
      console.error("🚨 ERROR: No se encontró el contenedor de servicios.");
      return;
    }

    container.innerHTML = ""; // 🔥 Limpiar el contenedor antes de agregar nuevos elementos

    servicios.slice(0, 7).forEach((servicio) => {
      if (!servicio || !servicio._id) return;

      console.log("📌 Creando carta-servicio para:", servicio);

      // 📌 Crear una instancia de `CartaServicios`
      const cartaServicio = document.createElement("carta-servicio");

      // 📌 Pasar los datos a la carta
      // @ts-ignore
      cartaServicio.servicio = servicio;

      // 📌 Agregar la carta al contenedor
      container.appendChild(cartaServicio);
    });

    console.log("✅ Servicios renderizados correctamente en el contenedor.");
  }
}
