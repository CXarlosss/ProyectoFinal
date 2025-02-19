import { importTemplate } from '../../../lib/importTemplate.js';

// Configuración del template
const TEMPLATE = {
  id: 'loginFormTemplate',
  url: '../../javascript/components/Login/LoginRegist.html'
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
      e.preventDefault();
  
      const API_PORT = location.port ? `:${location.port}` : '';
  
      // 🔥 🔥 SOLUCIÓN: Usar `shadowRoot.querySelector` correctamente
      const emailInput = /** @type {HTMLInputElement | null} */ (this.shadowRoot?.querySelector("#email-login"));
      const passwordInput =/** @type {HTMLInputElement | null} */( this.shadowRoot?.querySelector("#password-login"));
  
      console.log("📌 Verificando inputs...");
      console.log("🔍 emailInput:", emailInput);
      console.log("🔍 passwordInput:", passwordInput);
  
      if (!emailInput || !passwordInput) {
          console.error("❌ No se encontraron los campos de email o password.");
          alert("❌ Error en el formulario. Intenta recargar la página.");
          return;
      }
  
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();
  
      console.log("📩 Email ingresado:", email);
      console.log("🔑 Contraseña ingresada:", password);
  
      if (!email || !password) {
          alert("❌ Email y contraseña son obligatorios.");
          return;
      }
  
      try {
          console.log("📡 Enviando petición a la API...");
  
          const response = await fetch(`${location.protocol}//${location.hostname}${API_PORT}/api/read/users`);
          console.log("📡 Respuesta recibida:", response);
  
          if (!response.ok) throw new Error("Error al obtener usuarios");
  
          const usuariosAPI = await response.json();
          console.log("📜 Lista de usuarios obtenida:", usuariosAPI);
  
          const usuarioEncontrado = Array.isArray(usuariosAPI) &&
              usuariosAPI.find(user => user.email === email && user.password === password);
  
          console.log("🔍 Usuario encontrado:", usuarioEncontrado);
  
          if (usuarioEncontrado) {
              console.log("✅ Usuario autenticado:", usuarioEncontrado);
              localStorage.setItem("usuarioRegistrado", JSON.stringify(usuarioEncontrado));
              window.location.href = "paginadelusuario.html";
  
              this.dispatchEvent(new CustomEvent("login-form-submit", {
                  bubbles: true,
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




