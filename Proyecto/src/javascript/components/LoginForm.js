//Define login form component
/**
 * @class LoginForm
 * @emits 'login-form-submit'
 */
export class LoginForm extends HTMLElement {//Creamos clase propia que hereda de html element
    constructor() {//Creamos constructor
        super();//Llamamos al constructor de la clase padre
       
    }
    //Metodo que se ejecuta al crear el componente

    connectedCallback() {
      console.log("✅ LoginForm.js ha sido cargado correctamente");
      const shadow = this.attachShadow({ mode: "open" });

      // Importar y aplicar los estilos externos
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "../../css/styles-registrar.css"; // Asegúrate de que la ruta sea correcta

      // Contenedor para el formulario
      const wrapper = document.createElement("div");
      wrapper.innerHTML = `
        <form id="login-form">
          <label>Email: <input type="email" id="email-login" required /></label>
          <label>Contraseña: <input type="password" id="password-login" required /></label>
          <button type="submit">Iniciar Sesión</button>
        </form>
      `;

      // Agregar el `<link>` y el formulario al Shadow DOM
      shadow.appendChild(link);
      shadow.appendChild(wrapper);

      // Obtener el formulario dentro del shadowRoot
      const form = shadow.getElementById("login-form");
      form?.addEventListener("submit", this.onFormSubmit.bind(this));
  }
disconnecteCallback() {
    console.log('LoginForm disconnectedCallback');
    // Lógica para el componente
}
adoptedCallback() {
    console.log('LoginForm adoptedCallback');
    // Lógica para el componente
}
attributeChangedCallback(name, oldValue, newValue) {
    console.log(`Attribute ${name} has changed.`, oldValue, newValue);
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
          console.log("✅ Usuario autenticado:", usuarioEncontrado);
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




