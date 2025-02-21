// @ts-check
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

  let template = /** @type {HTMLTemplateElement | null} */ (document.body.querySelector(`#${TEMPLATE.id}`));
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
    const template = /** @type {HTMLTemplateElement | null} */ (document.body.querySelector(`#${TEMPLATE.id}`));

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
    this.shadowRoot?.replaceChildren(template.content.cloneNode(true));

    // ✅ Importar el CSS externo
    const linkElement = document.createElement("link");
    linkElement.rel = "stylesheet";
    linkElement.href = "../../css/styles-servicios.css";
    this.shadowRoot?.appendChild(linkElement);
    console.log("🎨 CSS importado:", linkElement.href);

    this._addEventListeners();
  }

  _addEventListeners() {
    console.log("🎯 Añadiendo eventos a los botones...");

    const buscador = /** @type {HTMLInputElement | null} */ (this.shadowRoot?.getElementById("buscador"));
    const btnBuscar = this.shadowRoot?.getElementById("btn-buscador");

    if (!buscador) {
      console.error("❌ No se encontró el input de búsqueda en el Shadow DOM.");
    }

    if (!btnBuscar) {
      console.error("❌ No se encontró el botón de búsqueda en el Shadow DOM.");
    }

    btnBuscar?.addEventListener("click", this.buscarServicios.bind(this));

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
          console.log(`✅ Botón ${id} presionado.`);
          console.log(`📡 Disparando evento: ${evento}`);
          console.log(`🎯 Elemento presionado:`, btn);
          this._dispatchEvent(evento);
        });

        console.log(`✅ Evento "${evento}" vinculado al botón #${id}`);
      } else {
        console.error(`❌ No se encontró el botón con ID "${id}"`);
      }
    });

    console.log("✅ Eventos añadidos correctamente.");
  }

  buscarServicios() {
    console.log("🔎 Ejecutando búsqueda...");

    const inputBuscador = /** @type {HTMLInputElement | null} */ (this.shadowRoot?.getElementById("buscador"));
    const busqueda = inputBuscador ? inputBuscador.value.trim().toLowerCase() : "";

    console.log("📡 Disparando evento 'buscar-servicios' con el término:", busqueda);

    // 📌 Enviar el término de búsqueda a <carta-serv>
    this._dispatchEvent("buscar-servicios", { busqueda });
  }


  formCrearServicio =  /** @type {HTMLFormElement | null} */ this.shadowRoot?.getElementById("crear-servicio-form");
  modalCrearServicio =   /** @type {HTMLDivElement | null} */this.shadowRoot?.getElementById("modal-crear-servicio");

  async crearServicio() {
    console.log("📡 Intentando crear servicio...");
  
    // Verifica si el modal está visible
    if (this.modalCrearServicio && this.modalCrearServicio.classList.contains("hidden")) {
      console.error("❌ El modal no está visible.");
      return;
    }
  
    // Verifica si el usuario está autenticado
    const usuarioGuardado = localStorage.getItem("usuarioRegistrado");
    const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
    if (!usuario || !usuario._id) {
      alert("⚠️ No estás autenticado. Inicia sesión para crear un servicio.");
      return;
    }
  
    // Obtener los valores del formulario
    const nuevoServicio = {
      // @ts-ignore
      nombre: this.shadowRoot?.getElementById("nombre-servicio")?.value,
      // @ts-ignore
      descripcion: this.shadowRoot?.getElementById("descripcion-servicio")?.value,
      // @ts-ignore
      ubicacion: this.shadowRoot?.getElementById("ubicacion-servicio")?.value,
      // @ts-ignore
      valoracion: Number(this.shadowRoot?.getElementById("valoracion-servicio")?.value),
      // @ts-ignore
      imagen: this.shadowRoot?.getElementById("imagen-servicio")?.value || "default.jpg",
      // @ts-ignore
      categoria: this.shadowRoot?.getElementById("categoria-servicio")?.value,
      // @ts-ignore
      precio: Number(this.shadowRoot?.getElementById("precio-servicio")?.value),
      // @ts-ignore
      horarios: this.shadowRoot?.getElementById("horario-servicio")?.value,
      // @ts-ignore
      metodoPago: this.shadowRoot?.getElementById("metodo-pago-servicio")?.value,
      // @ts-ignore
      etiquetas: this.shadowRoot?.getElementById("etiquetas-servicio")?.value,
      usuarioId: usuario ? usuario._id : null,
      emailUsuario: usuario ? usuario.email : null,
    };
  
    console.log("📡 Nuevo servicio:", nuevoServicio);
  
    // Validación de campos obligatorios
    if (!nuevoServicio.nombre || !nuevoServicio.descripcion || !nuevoServicio.ubicacion) {
      alert("⚠️ Todos los campos obligatorios deben estar llenos.");
      return;
    }
  
    // Enviar la solicitud para crear el servicio
    const API_PORT = location.port ? `:${location.port}` : "";
    const url = `${location.protocol}//${location.hostname}${API_PORT}/create/servicios`;
    console.log("URL generada para la solicitud:", url);
  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoServicio),
      });
  
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }
  
      const apiData = await response.json();
      console.log("✅ Servicio creado correctamente:", apiData);
      alert("✅ Servicio creado con éxito");
  
      // Disparar evento para actualizar la lista de servicios
      this._dispatchEvent("servicio-creado");
    } catch (error) {
      console.error("🚨 Error al crear el servicio:", error);
      alert("❌ Hubo un error al crear el servicio. Inténtalo de nuevo.");
    }
  }
  


  /**
   * 📡 Dispara eventos personalizados
   * @param {string} eventName
   * @param {Object} [detail={}]
   */
  _dispatchEvent(eventName, detail = {}) {
    document.dispatchEvent(new CustomEvent(eventName, { detail }));
  }
}