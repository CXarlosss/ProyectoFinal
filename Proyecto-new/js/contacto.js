// login.js
//@ts-check
// Simulación de datos de usuario registrados
const usuariosRegistrados = [
    {
        email: "usuario1@example.com",
        password: "password123",
    },
    {
        email: "usuario2@example.com",
        password: "securepass",
    },
];
    /** @type {HTMLInputElement | null} */
    const loginForm = /** @type {HTMLInputElement | null} */ (document.getElementById("loginForm"));
    /** @type {HTMLInputElement | null} */
    const loginMessage = /** @type {HTMLInputElement | null} */ (document.getElementById("loginMessage"));


// Manejar el evento de envío del formulario de login
loginForm?.addEventListener("submit", (event) => {
    event.preventDefault(); // Evitar la recarga de la página
   
    /** @type {HTMLInputElement | null} */
    const emailLoginElement = /** @type {HTMLInputElement | null} */ (document.getElementById("emailLogin"));
    /** @type {HTMLInputElement | null} */
    const passwordLoginElement = /** @type {HTMLInputElement | null} */ (document.getElementById("passwordLogin"));


    const email = emailLoginElement?.value.trim() || "";
    const password = passwordLoginElement?.value.trim() || "";

    // Validar los campos
    if (!email || !password) {
        mostrarMensaje("Por favor, completa todos los campos.", false);
        return;
    }

    // Verificar las credenciales
    const usuarioValido = usuariosRegistrados.some(
        (usuario) => usuario.email === email && usuario.password === password
    );

    if (usuarioValido) {
        mostrarMensaje("Inicio de sesión exitoso.", true);
        setTimeout(() => {
            window.location.href = "perfil.html"; // Redirigir a la página de perfil
        }, 2000);
    } else {
        mostrarMensaje("Correo o contraseña incorrectos.", false);
    }
});

/**
 * Muestra un mensaje de éxito o error.
 * @param {string} mensaje
 * @param {boolean} exito
 */
function mostrarMensaje(mensaje, exito) {
    if (loginMessage) {
        loginMessage.textContent = mensaje;
        loginMessage.style.color = exito ? "green" : "red";
    }
}
