document.addEventListener("DOMContentLoaded", () => {
    const usuarioGuardado = localStorage.getItem("usuarioRegistrado");

    if (!usuarioGuardado) {
        console.error("❌ No hay usuario registrado en localStorage.");
        alert("⚠️ No hay sesión activa. Redirigiendo a la página de registro...");
        window.location.href = "registrar.html"; 
        return;
    }

    // 🔥 SOLUCIÓN: Mostrar qué datos se están guardando
    console.log("✅ Usuario cargado desde localStorage:", usuarioGuardado);

    const usuario = JSON.parse(usuarioGuardado);

    if (!usuario || !usuario.email) {
        console.error("❌ Usuario inválido en localStorage:", usuario);
        alert("⚠️ Error en los datos de sesión. Redirigiendo...");
        window.location.href = "registrar.html";
        return;
    }

    console.log("✅ Usuario autenticado:", usuario);

    const btnServicios = document.getElementById("btn-ir-secciones"); 

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
