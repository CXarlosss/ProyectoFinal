/**
 * @class RegisterForm
 * @emits 'register-form-submit'
 */

export class RegisterForm extends HTMLElement {
    constructor() {
      super();
    }
  
    connectedCallback() {
      console.log("✅ RegisterForm.js ha sido cargado correctamente");
      const shadow = this.attachShadow({ mode: "open" });

      
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "../../css/styles-registrar.css"; 

      // Crear un contenedor para el formulario
      const wrapper = document.createElement("div");
      wrapper.innerHTML = `
        <form id="registerForm">
          <label>Nombre: <input type="text" id="nombre-usuario" required /></label>
          <label>Email: <input type="email" id="email-usuario" required /></label>
          <label>Teléfono: <input type="text" id="telefono-usuario" required /></label>
          <label>Dirección: <input type="text" id="direccion-usuario" required /></label>
          <label>Contraseña: <input type="password" id="password-usuario" required /></label>
          <button type="submit">Registrar Usuario</button>
        </form>
      `;

      // Agregar el <link> y el formulario al Shadow DOM
      shadow.appendChild(link);
      shadow.appendChild(wrapper);

      const form = shadow.getElementById("registerForm");
      form?.addEventListener("submit", this.onFormSubmit.bind(this));
  }
    
  
    disconnectedCallback() {
      console.log("📌 Custom element removed from page.");
    }
  
    adoptedCallback() {
      console.log("📌 Custom element moved to new page.");
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      console.log(`📌 Attribute ${name} has changed.`, oldValue, newValue);
    }
  
    /**
     * 📌 Manejador del evento de envío del formulario
     */
    async onFormSubmit(e) {
      e.preventDefault();
  
      const API_PORT = location.port ? `:${location.port}` : "";
  
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
  
        const apiResponse = await fetch(`${location.protocol}//${location.hostname}${API_PORT}/api/create/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevoUsuario),
          });
    
          if (!apiResponse.ok) throw new Error("Error al registrar usuario");
    
          const usuarioCreado = await apiResponse.json();
          console.log("✅ Usuario registrado:", usuarioCreado);
          localStorage.setItem("usuarioRegistrado", JSON.stringify(usuarioCreado));
          window.location.href = "paginadelusuario.html";
    
          // Emitir evento con `bubbles: true`
          this.dispatchEvent(new CustomEvent("register-form-submit", {
            bubbles: true,
            detail: usuarioCreado,
          }));
    
        } catch (error) {
          console.error("❌ Error:", error);
          alert("❌ Error al registrar usuario.");
        }
      }
    }
  // Definir el componente web en el navegador
  customElements.define("register-form", RegisterForm);

  