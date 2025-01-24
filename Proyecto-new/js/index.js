// inicio.js
//@ts-check
// Simulación de interactividad básica
// Agregar eventos a botones para navegación o mensajes

document.addEventListener("DOMContentLoaded", () => {
    // Botón para explorar servicios
    const btnExplorarServicios = document.querySelector(".btn-primary");
    btnExplorarServicios?.addEventListener("click", () => {
        console.log("Navegando a la página de Servicios...");
    });

    // Botón para ir al perfil del usuario
    const btnMiPerfil = document.querySelector(".btn-secondary");
    btnMiPerfil?.addEventListener("click", () => {
        console.log("Navegando a la página de Usuario...");
    });

    // Mostrar mensaje en la consola cuando se hace scroll en la página
    window.addEventListener("scroll", () => {
        console.log("El usuario está haciendo scroll en la página.");
    });
});