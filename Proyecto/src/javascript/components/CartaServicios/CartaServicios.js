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
//MAS DETALLESS
  async toggleDetalles() {
    const detallesContainer = this.shadowRoot?.querySelector(".detalles-container");

    if (!detallesContainer) return;
    
    // Si los detalles ya están cargados, solo los muestra u oculta
    if (this.detallesCargados) {
      // @ts-ignore
      detallesContainer.style.display = detallesContainer.style.display === "none" ? "block" : "none";
      return;
    }

    const servicioId = this.getAttribute("_id");
    const API_PORT = location.port ? `:${location.port}` : "";
    const API_URL = `${location.protocol}//${location.hostname}${API_PORT}/read/servicio/${servicioId}`;

    try {
      console.log("🔄 Cargando detalles del servicio...");
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("❌ Error al obtener detalles del servicio");

      const servicio = await response.json();
      console.log("✅ Detalles del servicio obtenidos:", servicio);

      detallesContainer.innerHTML = `
        <p><strong>Contacto:</strong> ${servicio.emailUsuario || "No disponible"}</p>
        <p><strong>Horario:</strong> ${servicio.horario || "No especificado"}</p>
        <p><strong>Precio:</strong> ${servicio.precio ? `$${servicio.precio}` : "Consultar"}</p>
      `;

      // @ts-ignore
      detallesContainer.style.display = "block";
      this.detallesCargados = true; // Marcar como cargados para evitar múltiples peticiones

    } catch (error) {
      console.error("🚨 Error al cargar detalles:", error);
    }
  }
  //FAVORITOSSS

  /**
   * @param {string} servicioId
   */
  /**
   * 📌 Método para alternar el estado de favorito en la base de datos y actualizar la UI
   * @param {string} servicioId - ID del servicio a agregar o quitar de favoritos
   */
  async toggleFavorito(servicioId) {
    const usuarioGuardado = localStorage.getItem("usuarioRegistrado");
    /** @type {{ _id: string } | null} */
    const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;

    if (!usuario || !usuario._id) {
      console.error("❌ Error: Usuario no autenticado.");
      return;
    }

    console.log(`📌 Enviando solicitud para actualizar favoritos del usuario ${usuario._id}`);

    const API_PORT = location.port ? `:${location.port}` : "";
    const url = `${location.protocol}//${location.hostname}${API_PORT}/users/${usuario._id}/favoritos/${servicioId}`;
/*     const url = `${location.protocol}//${location.hostname}${API_PORT}/api/users/${usuario._id}/favoritos/${servicioId}`; */

    // Verificar si el servicio ya está en favoritos
    const favoritosGuardados = localStorage.getItem(`favoritos_${usuario._id}`);
    /** @type {{ _id: string }[]} */
    const favoritos = favoritosGuardados ? JSON.parse(favoritosGuardados) : [];
    
    const esFavorito = favoritos.some(fav => fav._id === servicioId);
    const metodo = "PUT";  // 🔥 Se usa PUT en todos los casos

    try {
      const response = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        cache: "no-cache",
      });

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }

      console.log(`✅ Favorito ${esFavorito ? "eliminado" : "añadido"} correctamente.`);

      // Actualizar el estado de favoritos en localStorage
      if (esFavorito) {
        const nuevosFavoritos = favoritos.filter(fav => fav._id !== servicioId);
        localStorage.setItem(`favoritos_${usuario._id}`, JSON.stringify(nuevosFavoritos));
      } else {
        favoritos.push({ _id: servicioId });
        localStorage.setItem(`favoritos_${usuario._id}`, JSON.stringify(favoritos));
      }

      // Actualizar la UI
      this.actualizarBotonFavorito(servicioId, !esFavorito);

    } catch (error) {
      console.error("🚨 Error al actualizar favoritos:", error);
    }
}

/**
   * 📌 Método para actualizar el texto del botón de favoritos
   * @param {string} id - ID del servicio
   * @param {boolean} esFavorito - Indica si el servicio es favorito o no
   */
actualizarBotonFavorito(id, esFavorito) {
  const btnFavorito = this.shadowRoot?.querySelector(".btn-favorito");
  if (btnFavorito) {
    btnFavorito.textContent = esFavorito ? "★ Quitar de Favoritos" : "☆ Añadir a Favoritos";
  }
}
/**
 * 📌 Método para editar un servicio
 * @param {string} servicioId - ID del servicio a editar
 */
async editarServicio(servicioId) {
  if (!this.shadowRoot) return;

  console.log(`✏️ Editar servicio: ${servicioId}`);

  // @ts-ignore
  const nuevoNombre = prompt("Nuevo nombre del servicio:", this.getAttribute("nombre"));
  if (!nuevoNombre) {
      console.log("✏️ Edición cancelada.");
      return;
  }

  const API_PORT = location.port ? `:${location.port}` : "";
/*   const url = `${location.protocol}//${location.hostname}${API_PORT}/api/update/servicios/${servicioId}`; */
  const url = `${location.protocol}//${location.hostname}${API_PORT}/update/servicios/${servicioId}`;
  try {
      const response = await fetch(url, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre: nuevoNombre }),
      });

      if (!response.ok) {
          throw new Error(`Error en la actualización: ${response.statusText}`);
      }

      console.log(`✅ Servicio con ID ${servicioId} actualizado correctamente.`);
      this.setAttribute("nombre", nuevoNombre);
      this.render(); // Actualizar la UI
  } catch (error) {
      console.error("🚨 Error al actualizar el servicio:", error);
  }
}

/**
* 📌 Método para eliminar un servicio
* @param {string} servicioId - ID del servicio a eliminar
*/
async eliminarServicio(servicioId) {
  if (!this.shadowRoot) return;

  const confirmacion = confirm("¿Estás seguro de eliminar este servicio?");
  if (!confirmacion) return;

  console.log(`🗑 Eliminando servicio con ID: ${servicioId}...`);

  const API_PORT = location.port ? `:${location.port}` : "";
 /*  const url = `${location.protocol}//${location.hostname}${API_PORT}/api/delete/servicios/${servicioId}`; */
  const url = `${location.protocol}//${location.hostname}${API_PORT}/delete/servicios/${servicioId}`;
  try {
      const response = await fetch(url, { method: "DELETE" });

      if (!response.ok) {
          throw new Error(`Error en la eliminación: ${response.statusText}`);
      }

      console.log(`✅ Servicio con ID ${servicioId} eliminado correctamente.`);
      this.remove(); // Eliminar la tarjeta de la UI
  } catch (error) {
      console.error("🚨 Error al eliminar el servicio:", error);
  }
}



  /** 📌 Agrega eventos a los botones de la carta */
  addEventListeners() {
    if (!this.shadowRoot) return;

    const id = this.getAttribute("_id");
    if (!id) {
        console.error("❌ No se encontró `_id` en la tarjeta de servicio.");
        return;
    }

    // 📜 Evento "Más Detalles"
    const btnDetalles = this.shadowRoot.querySelector(".btn-detalles");
    if (btnDetalles) {
        btnDetalles.setAttribute("data-_id", id); // ✅ Asegurar que tenga `data-_id`
        btnDetalles.addEventListener("click", () => {
            console.log(`📌 Ver detalles del servicio: ${id}`);
            window.location.href = `serviciosin.html?_id=${encodeURIComponent(id)}`;
        });

    // ⭐ Evento "Añadir a Favoritos"
      // ⭐ Evento "Añadir a Favoritos"
    
      const btnFavorito = this.shadowRoot.querySelector(".btn-favorito");
      if (btnFavorito) {
          btnFavorito.addEventListener("click", async () => {
              console.log(`⭐ Intentando añadir/quitar favorito: ${id}`);
              await this.toggleFavorito(id);
          });
      }
      


      // ✏️ Evento "Editar Servicio"
      const btnEditar = this.shadowRoot.querySelector(".btn-editar");
      btnEditar?.addEventListener("click", () => {
          this.editarServicio(id);
      });

      // 🗑 Evento "Eliminar Servicio"
      const btnEliminar = this.shadowRoot.querySelector(".btn-eliminar");
      btnEliminar?.addEventListener("click", () => {
          this.eliminarServicio(id);
      });
        }
      }

}
customElements.define("carta-servicio", CartaServicio);
export { CartaServicio };
