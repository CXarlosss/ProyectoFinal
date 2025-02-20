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
    this.loadTemplate();
  }

  async loadTemplate() {
    const template = document.body.querySelector("#carta-serv-container-template");

    if (!template) {
      let intentos = 0;
      const maxIntentos = 10;

      const intervalo = setInterval(() => {
        const template = document.body.querySelector("#carta-serv-container-template");
        if (template) {
          clearInterval(intervalo);
          // @ts-ignore
          this.shadowRoot?.appendChild(template.content.cloneNode(true));
        } else if (intentos >= maxIntentos) {
          clearInterval(intervalo);
        }
        intentos++;
      }, 300);
    } else {
      // @ts-ignore
      this.shadowRoot?.appendChild(template.content.cloneNode(true));
    }
  }

  set servicios(value) {
    this._servicios = value;
    this.render();
  }

  get servicios() {
    return this._servicios;
  }

  render() {

    const container = this.shadowRoot?.querySelector("#servicios-container");
    if (!container) {
      console.error("❌ No se encontró `#servicios-container` dentro de `<carta-serv>`. Asegúrate de que el template está bien insertado.");
      return;
    }

    console.log("✅ `#servicios-container` encontrado. Limpiando y agregando servicios...");
    container.innerHTML = ""; // Limpiar contenido anterior

    this._servicios.forEach(servicio => {
      const servicioElement = document.createElement("carta-servicio");

      servicioElement.setAttribute("nombre", servicio.nombre);
      servicioElement.setAttribute("descripcion", servicio.descripcion);
      servicioElement.setAttribute("ubicacion", servicio.ubicacion);
      servicioElement.setAttribute("valoracion", servicio.valoracion);
      servicioElement.setAttribute("imagen", servicio.imagen);

      container.appendChild(servicioElement);
    });

  }
}

if (!customElements.get("carta-serv")) {
  customElements.define("carta-serv", CartaSERV);
}
