import { importTemplate } from '../../../lib/importTemplate.js';

// Configuración del template
const TEMPLATE = {
  id: 'registrarFormTemplate',
  url: '../../javascript/components/CartaSERV/CartaSERV.html'

};

// Esperar a que el template esté en el DOM antes de definir el componente
async function loadAndDefineComponent() {
 

  await importTemplate(TEMPLATE.url);
 

  // Esperamos hasta que el template realmente aparezca en el DOM
  let checkInterval = setInterval(() => {
    let template = document.body.querySelector(`#${TEMPLATE.id}`);
    
    if (template) {
      clearInterval(checkInterval);
      
      
      // **Solución: Solo definir si no está registrado**
      if (!customElements.get("registrar-form")) {
       
        customElements.define("registrar-form", RegistrarForm);
      } else {
        console.warn("⚠️ El elemento <registrar-form> ya está definido. Omitiendo redefinición.");
      }
    }
  }, 100); // Chequea cada 100ms hasta que el template esté en el DOM
}


// Llamar la función para cargar y definir el componente
loadAndDefineComponent();

export class RegistrarForm extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      
    }

    get template() {
      return document.body.querySelector(`#${TEMPLATE.id}`);
    }

    connectedCallback() {


      if (!this.shadowRoot) {
        this.attachShadow({ mode: "open" });
      }

      // Verificar periódicamente si el template ya está disponible antes de continuar
      let checkTemplateInterval = setInterval(() => {
        if (this.template) {
          clearInterval(checkTemplateInterval);
      
          this._setUpContent();

          const form = this.shadowRoot?.querySelector("#registrar-form");
       

          if (form) {
            form.addEventListener("submit", this.onFormSubmit.bind(this));
          }
        }
      }, 100); // Revisa cada 100ms si el template ya está disponible
    }

    _setUpContent() {

      const template = this.template;
    
      if (!template) {
      
        return;
      }
    
 
      // @ts-ignore
      this.shadowRoot?.replaceChildren(template.content.cloneNode(true));
    
      // Crear el link para importar el CSS externo
      const linkElement = document.createElement("link");
      linkElement.rel = "stylesheet";
      linkElement.href = "../../css/styles-registrar.css"; // Ruta del archivo CSS
    
      // Agregar el link al Shadow DOM
      this.shadowRoot?.appendChild(linkElement);
    }
    



    /**
     * 📌 Manejador del evento de envío del formulario
     */
    async onFormSubmit(e) {


      const API_PORT = location.port ? `:${location.port}` : "";
     e.preventDefault();
  
      const nombre = /** @type {HTMLInputElement} */ (this.shadowRoot?.getElementById("nombre-usuario"))?.value.trim();
      const email = /** @type {HTMLInputElement} */ (this.shadowRoot?.getElementById("email-usuario"))?.value.trim();
      const telefono = /** @type {HTMLInputElement} */ (this.shadowRoot?.getElementById("telefono-usuario"))?.value.trim();
      const direccion = /** @type {HTMLInputElement} */ (this.shadowRoot?.getElementById("direccion-usuario"))?.value.trim();
      const password = /** @type {HTMLInputElement} */ (this.shadowRoot?.getElementById("password-usuario"))?.value.trim();
  
      if (!nombre || !email || !telefono || !direccion || !password) {
        alert("❌ Todos los campos son obligatorios.");
        return;
      }
  
      try {
        const response = await fetch(`${location.protocol}//${location.hostname}${API_PORT}/api/read/users`);
        if (!response.ok) throw new Error("Error al obtener usuarios");
  
        const usuariosAPI = await response.json();
        const usuarioExistente = Array.isArray(usuariosAPI) && usuariosAPI.some(user => user.email === email);
  
        if (usuarioExistente) {
          alert("⚠️ Este email ya está registrado. Inicia sesión.");
          return;
        }
  
        const nuevoUsuario = { nombre, email, password, telefono, direccion };
  
        const apiResponse = await fetch(`${location.protocol}//${location.hostname}${API_PORT}/create/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nuevoUsuario),
      });
      
      if (!apiResponse.ok) throw new Error("Error al registrar usuario");
      
      const resultado = await apiResponse.json();
      console.log("✅ Respuesta de la API:", resultado);
      
      if (resultado.acknowledged && resultado.insertedId) {
          // Recuperar los datos completos del usuario recién creado
          const usuarioCompleto = { 
              _id: resultado.insertedId, 
              ...nuevoUsuario 
          };
      
          console.log("✅ Guardando usuario completo en localStorage:", usuarioCompleto);
          localStorage.setItem("usuarioRegistrado", JSON.stringify(usuarioCompleto));
          window.location.href = "paginadelusuario.html";
      } else {
          console.error("❌ Error: Respuesta inesperada de la API", resultado);
          alert("❌ Hubo un problema al registrar el usuario.");
      }
      
    
        } catch (error) {
          console.error("❌ Error:", error);
          alert("❌ Error al registrar usuario.");
        }
      }
    }
  // Definir el componente web en el navegador
  customElements.define("registrar-form", RegistrarForm);

  