document.addEventListener("DOMContentLoaded", () => {
    //Verificamos si hay un usuario registrado
    // Si no hay un usuario registrado, redirigir a la página de registro
    // Si hay un usuario registrado, mostrar el nombre del usuario en la bienvenida
    const usuarioGuardado = localStorage.getItem("usuarioRegistrado");
    if (!usuarioGuardado) {
        console.error("❌ No hay usuario registrado en localStorage.");
        alert("⚠️ No hay sesión activa. Redirigiendo a la página de registro...");
        window.location.href = "registrar.html"; 
        return;
    }
    console.log("✅ Usuario cargado desde localStorage:", usuarioGuardado);
    const usuario = JSON.parse(usuarioGuardado);
    if (!usuario || !usuario.email) {
        console.error("❌ Usuario inválido en localStorage:", usuario);
        alert("⚠️ Error en los datos de sesión. Redirigiendo...");
        window.location.href = "registrar.html";
        return;
    }
    console.log("✅ Usuario autenticado:", usuario);
    // Mostrar el nombre del usuario en la bienvenida
    const nombreSpan = document.getElementById("nombre");
    if (usuario.nombre && nombreSpan) {
        nombreSpan.textContent = usuario.nombre;
    } else {
        console.warn("⚠️ No se encontró el elemento #nombre o el usuario no tiene un nombre registrado.");
    }
    const btnServicios = document.getElementById("btn-ir-secciones"); 
    if (btnServicios) {
        btnServicios.addEventListener("click", irAServicios);
    } else {
        console.warn("⚠️ No se encontró el botón de servicios en el DOM.");
    }
    
  // Función para cerrar sesión
 function cerrarSesion() {
        if (confirm("¿Estás seguro de que quieres cerrar sesión?")) {
            localStorage.removeItem("usuarioRegistrado");
            window.location.href = "registrar.html"; 
        }
    }
    //No esta implementado el menu hamburguesa
    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector("nav ul");
    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", () => {
            navMenu.classList.toggle("show");
        });
    }
    //  Agregar evento al botón de cerrar sesión
    const btnCerrarSesion = document.getElementById("btn-cerrar-sesion");
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener("click", cerrarSesion);
    }
function irAServicios() {
    if (confirm("¿Estás seguro de que quieres ir a Servicios?")) {
            window.location.href = "servicios.html";
        }
    }
    
});
