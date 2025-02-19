import { importTemplate } from '../../lib/importTemplate.js';

// Configuración del template
const TEMPLATE = {
  id: 'loginFormTemplate',
  url: './javascript/components/LoginRegist.html'
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
      if (!customElements.get("login-form")) {
        
        customElements.define("login-form", LoginForm);
      } else {
        console.warn("⚠️ El elemento <login-form> ya está definido. Omitiendo redefinición.");
      }
    }
  }, 100); // Chequea cada 100ms hasta que el template esté en el DOM
}

// Llamar la función para cargar y definir el componente
loadAndDefineComponent();

export class LoginForm extends HTMLElement {
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

          const form = this.shadowRoot?.querySelector("#login-form");
          

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
  async onFormSubmit(e) {
    const API_PORT = location.port ? `:${location.port}` : ''
    e.preventDefault();

    
    const email =/** @type {HTMLInputElement} */ (document.getElementById("email-login"))?.value.trim() ?? "";
    const password =/** @type {HTMLInputElement} */(document.getElementById("password-login") )?.value.trim() ?? "";

    if (!email || !password) {
      alert("❌ Email y contraseña son obligatorios.");
      return;
    }

    try {
        const response = await fetch(`${location.protocol}//${location.hostname}${API_PORT}/api/read/users`);
        if (!response.ok) throw new Error("Error al obtener usuarios");
  
        const usuariosAPI = await response.json();
        const usuarioEncontrado = Array.isArray(usuariosAPI) &&
          usuariosAPI.find(user => user.email === email && user.password === password);
  
        if (usuarioEncontrado) {
   
          localStorage.setItem("usuarioRegistrado", JSON.stringify(usuarioEncontrado));
          window.location.href = "paginadelusuario.html";
  
          // Emitir evento personalizado con bubbles
          this.dispatchEvent(new CustomEvent("login-form-submit", {
            bubbles: true, // ✅ Permite que el evento suba en el DOM
            detail: usuarioEncontrado
          }));
        } else {
          alert("⚠️ Email o contraseña incorrectos.");
          this.dispatchEvent(new CustomEvent("login-form-submit", {
            bubbles: true,
            detail: null
          }));
        }
      } catch (error) {
        console.error("❌ Error:", error);
        alert("❌ Error al iniciar sesión.");
        this.dispatchEvent(new CustomEvent("login-form-submit", {
          bubbles: true,
          detail: null
        }));
      }

    }



}
customElements.define('login-form', LoginForm);




