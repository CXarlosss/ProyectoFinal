// @ts-nocheck
import { importTemplate } from "../../../lib/importTemplate.js";

console.log("📌 BuscadorServicios.js cargado correctamente.");

// 📌 Configuración del template
const TEMPLATE = {
  id: "buscador-template",
  url: "../../javascript/components/Busqueda/BuscadorServicios.html",
};

/**
 * 📌 Función para cargar y definir el componente
 */
async function loadAndDefineComponent() {
  console.log("⏳ Intentando importar template desde:", TEMPLATE.url);

  try {
    await importTemplate(TEMPLATE.url);
    console.log("✅ Template importado correctamente.");
  } catch (error) {
    console.error("❌ Error al importar el template:", error);
    return;
  }

  // 🔥 ESPERAMOS QUE EL TEMPLATE ESTÉ DISPONIBLE 🔥
  let template = document.body.querySelector(`#${TEMPLATE.id}`);
  if (!template) {
    console.error("❌ El template no se encontró en el DOM. Esperando...");
    setTimeout(loadAndDefineComponent, 500); // Reintenta después de 500ms
    return;
  }

  console.log("🔍 Template encontrado en el DOM.");

  // ✅ Solo registrar el custom element si aún no está definido
  if (!customElements.get("buscador-servicios")) {
    console.log("🆕 Definiendo <buscador-servicios> como Web Component...");
    customElements.define("buscador-servicios", BuscadorServicios);
  } else {
    console.warn("⚠️ El elemento <buscador-servicios> ya está definido.");
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
    return document.body.querySelector(`#${TEMPLATE.id}`);
  }

  connectedCallback() {
    console.log("✅ <buscador-servicios> conectado al DOM.");
    this._loadTemplate();
  }

  _loadTemplate() {
    console.log("🛠 Cargando template dentro del componente...");

    const template = this.template;
    if (!template) {
      console.error("❌ No se pudo cargar el template.");
      return;
    }

    console.log("✅ Template clonado en el Shadow DOM.");
    this.shadowRoot.replaceChildren(template.content.cloneNode(true));

    // ✅ Importar CSS
    const linkElement = document.createElement("link");
    linkElement.rel = "stylesheet";
    linkElement.href = "../../css/styles-servicios.css";
    this.shadowRoot.appendChild(linkElement);
    console.log("🎨 CSS importado:", linkElement.href);

    this._addEventListeners();
  }

  _addEventListeners() {
    console.log("🎯 Añadiendo eventos...");
  
    setTimeout(() => {
      const filtros = [
        { id: "btn-filtrar-actividades", evento: "filtrar-actividades" },
        { id: "btn-filtrar-comercios", evento: "filtrar-comercios" },
        { id: "btn-mostrar-todos", evento: "mostrar-todos" },
        { id: "btn-crear-servicio", evento: "crear-servicio" }
      ];
  
      filtros.forEach(({ id, evento }) => {
        const btn = this.shadowRoot?.getElementById(id);
        if (btn) {
          btn.addEventListener("click", () => {
            console.log(`✅ Botón ${id} presionado. Disparando evento: ${evento}`);
            this._dispatchEvent(evento);
          });
          console.log(`🎯 Evento asignado al botón: ${id}`);
        } else {
          console.error(`❌ No se encontró el botón con ID "${id}". Intentando de nuevo...`);
        }
      });
  
      // 🛠️ Añadir evento al input de búsqueda
      const inputBuscar = this.shadowRoot?.getElementById("input-busqueda");
  
      if (inputBuscar) {
        console.log("✅ Input de búsqueda encontrado.");
        inputBuscar.addEventListener("input", (event) => {
          const busqueda = event.target.value.trim().toLowerCase();
          console.log(`📡 Emitiendo evento "buscar-servicios" con término: ${busqueda}`);
  
          // 🔥 Emitimos el evento
          document.dispatchEvent(new CustomEvent("buscar-servicios", {
            detail: { busqueda },
          }));
        });
      } else {
        console.error("❌ No se encontró el input de búsqueda en el Shadow DOM.");
      }
    }, 500); // Esperamos 500ms para asegurar que el Shadow DOM esté listo
  }
  

  /**
   * 📌 Filtra los servicios en base a la búsqueda
   * @param {string} query - Texto a buscar
   */
  _filtrarServicios(query) {
    const servicios = this.shadowRoot?.querySelectorAll(".servicio-item");
    
    servicios.forEach((servicio) => {
      const nombre = servicio.textContent.trim().toLowerCase();
      if (nombre.includes(query)) {
        servicio.style.display = "block";
      } else {
        servicio.style.display = "none";
      }
    });
  }

  _dispatchEvent(eventName, detail = {}) {
    document.dispatchEvent(new CustomEvent(eventName, { detail }));
  }
}
