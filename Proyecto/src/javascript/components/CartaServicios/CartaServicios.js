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
 */

// 📌 Configuración del template
const TEMPLATE = {
  id: "carta-servicios-template",
  url: "../../javascript/components/CartaServicios/CartaServicios.html",
};

// 📌 Obtener usuario autenticado desde localStorage
const usuarioGuardado = localStorage.getItem("usuarioRegistrado");
const usuario = usuarioGuardado ? /** @type {{email: string} | null} */ (JSON.parse(usuarioGuardado)) : null;
console.log("📌 Usuario autenticado en localStorage:", usuario);

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

  // 🔥 Esperar hasta que el template esté en el DOM
  let checkInterval = setInterval(() => {
    const template = /** @type {HTMLTemplateElement | null} */ (document.body.querySelector(`#${TEMPLATE.id}`));

    if (template) {
      clearInterval(checkInterval);
      console.log("✅ Template disponible en el DOM.");

      if (!customElements.get("carta-servicio")) {
        console.log("🆕 Definiendo <carta-servicio> como Web Component...");
        customElements.define("carta-servicio", CartaServicio);
      } else {
        console.warn("⚠️ <carta-servicio> ya está definido. Omitiendo redefinición.");
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

  static get observedAttributes() {
    return ["_id", "nombre", "descripcion", "ubicacion", "valoracion", "imagen", "emailUsuario"];
  }

  /**
   * @param {string} name
   * @param {string | null} oldValue
   * @param {string | null} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`📌 Atributo cambiado en <carta-servicio>: ${name} = ${newValue}`);
    this.render();
  }

  connectedCallback() {
    console.log("✅ <carta-servicio> conectado al DOM.");
    console.log("📌 Atributos actuales:", {
        _id: this.getAttribute("_id"),
        nombre: this.getAttribute("nombre"),
        emailUsuario: this.getAttribute("emailUsuario"),
    });

    this.render();
    this.addEventListeners();
}


  /**
   * 📌 Obtiene el template del documento.
   * @returns {HTMLTemplateElement | null}
   */
  get template() {
    console.log("🔍 Intentando obtener template del DOM...");
    return /** @type {HTMLTemplateElement | null} */ (document.body.querySelector(`#${TEMPLATE.id}`));
  }

  /**
   * 📌 Renderiza el servicio en la tarjeta.
   */
  render() {
    console.log("📌 Renderizando <carta-servicio>...");

    if (!this.shadowRoot) {
      console.error("❌ Shadow DOM no disponible en <carta-servicio>.");
      return;
    }

    const template = this.template;
    if (!template) {
      console.error("❌ No se encontró `#carta-servicios-template`.");
      return;
    }

    this.shadowRoot.innerHTML = "";
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // ✅ Importar CSS externo
    const linkElement = document.createElement("link");
    linkElement.rel = "stylesheet";
    linkElement.href = "../../css/styles-servicios.css";
    this.shadowRoot.appendChild(linkElement);

    console.log("🎨 CSS importado:", linkElement.href);

    // 📌 Asignar valores a la tarjeta
    const img = /** @type {HTMLImageElement | null} */ (this.shadowRoot.querySelector(".card-img"));
    const nombre = /** @type {HTMLElement | null} */ (this.shadowRoot.querySelector(".servicio-nombre"));
    const descripcion = /** @type {HTMLElement | null} */ (this.shadowRoot.querySelector(".servicio-descripcion"));
    const ubicacion = /** @type {HTMLElement | null} */ (this.shadowRoot.querySelector(".servicio-ubicacion"));
    const valoracion = /** @type {HTMLElement | null} */ (this.shadowRoot.querySelector(".servicio-valoracion"));

    if (img) img.src = this.getAttribute("imagen") || "default.jpg";
    if (nombre) nombre.textContent = this.getAttribute("nombre") || "Nombre no disponible";
    if (descripcion) descripcion.textContent = this.getAttribute("descripcion") || "Descripción no disponible";
    if (ubicacion) ubicacion.textContent = `Ubicación: ${this.getAttribute("ubicacion") || "Ubicación no disponible"}`;
    if (valoracion) valoracion.textContent = `Valoración: ${this.getAttribute("valoracion") || "No valorado"}`;

    // 📌 Ocultar o mostrar botones según el usuario
    const emailUsuario = this.getAttribute("emailUsuario");
    const btnEditar = this.shadowRoot.querySelector(".btn-editar");
    const btnEliminar = this.shadowRoot.querySelector(".btn-eliminar");

    console.log("📌 Email del propietario:", emailUsuario);
    console.log("📌 Email del usuario autenticado:", usuario?.email);

    if (!usuario || usuario.email !== emailUsuario) {
      
      btnEditar?.classList.add("hidden");
      btnEliminar?.classList.add("hidden");

      // 🔥 Asegurar ocultación completa
      // @ts-ignore
      if (btnEditar) btnEditar.style.display = "none";
      // @ts-ignore
      if (btnEliminar) btnEliminar.style.display = "none";
    } else {
      
      btnEditar?.classList.remove("hidden");
      btnEliminar?.classList.remove("hidden");

      // @ts-ignore
      if (btnEditar) btnEditar.style.display = "inline-block";
      // @ts-ignore
      if (btnEliminar) btnEliminar.style.display = "inline-block";
    }
  }

  /** 📌 Agrega eventos a los botones de la carta */
  addEventListeners() {
    if (!this.shadowRoot) return;

    const id = this.getAttribute("_id"); // Obtener el ID del servicio

    // 📜 Evento "Más Detalles"
    const btnDetalles = this.shadowRoot.querySelector(".btn-detalles");
    btnDetalles?.addEventListener("click", () => {
      console.log(`📌 Ver detalles del servicio: ${id}`);
      window.location.href = `servicio.html?_id=${encodeURIComponent(id || "")}`;
    });

    // ⭐ Evento "Añadir a Favoritos"
    const btnFavorito = this.shadowRoot.querySelector(".btn-favorito");
    btnFavorito?.addEventListener("click", () => {
      console.log(`⭐ Añadir/Quitar favorito: ${id}`);
      document.dispatchEvent(new CustomEvent("toggle-favorito", { detail: { id } }));
    });

    // ✏️ Evento "Editar Servicio"
    const btnEditar = this.shadowRoot.querySelector(".btn-editar");
    btnEditar?.addEventListener("click", () => {
      console.log(`✏️ Editar servicio: ${id}`);
      document.dispatchEvent(new CustomEvent("editar-servicio", { detail: { id } }));
    });

    // 🗑 Evento "Eliminar Servicio"
    const btnEliminar = this.shadowRoot.querySelector(".btn-eliminar");
    btnEliminar?.addEventListener("click", () => {
      console.log(`🗑 Eliminar servicio: ${id}`);
      const confirmacion = confirm("¿Estás seguro de eliminar este servicio?");
      if (confirmacion) {
        document.dispatchEvent(new CustomEvent("eliminar-servicio", { detail: { id } }));
      }
    });
  }
}

customElements.define("carta-servicio", CartaServicio);
export { CartaServicio };
