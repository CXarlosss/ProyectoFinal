document.addEventListener("DOMContentLoaded", () => {
    console.log("📌 Cargando página de usuario...");
  

    const usuarioGuardado = localStorage.getItem("usuarioRegistrado");
    if (!usuarioGuardado) {
        console.error("❌ No hay usuario registrado en localStorage.");
        window.location.href = "registrar.html"; // Redirigir si no hay sesión activa
        return;
    }
    
    const usuario = JSON.parse(usuarioGuardado);
    console.log("✅ Usuario cargado:", usuario);
    const btnServicios = document.getElementById("btn-ir-secciones"); // Asegúrate de que el botón existe

    if (btnServicios) {
        btnServicios.addEventListener("click", irAServicios);
    } else {
        console.warn("⚠️ No se encontró el botón de servicios en el DOM.");
    }
    
   /*  // Cargar módulos de favoritos y mensajes
    const scriptFavoritos = document.createElement("script");
    scriptFavoritos.src = "./javascript/UsuarioFavoritos.js";
    document.body.appendChild(scriptFavoritos);

    const scriptMensajes = document.createElement("script");
    scriptMensajes.src = "./javascript/UsuarioMensajes.js";
    document.body.appendChild(scriptMensajes); */

    // 📌 Función para cerrar sesión
    function cerrarSesion() {
        if (confirm("¿Estás seguro de que quieres cerrar sesión?")) {
            localStorage.removeItem("usuarioRegistrado"); // Eliminar usuario
            window.location.href = "registrar.html"; // Redirigir a la página de inicio de sesión
        }
    }

    // 📌 Agregar evento al botón de cerrar sesión
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
