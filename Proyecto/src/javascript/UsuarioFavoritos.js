//@ts-check
import {abrirChat} from "./UsuarioMensajes.js"; 

document.addEventListener("DOMContentLoaded", () => {
    console.log("📌 Cargando módulo de favoritos...");

    const favoritosList = document.getElementById("favoritos-list");

    async function cargarFavoritos() {
        try {
            const usuarioGuardado = localStorage.getItem("usuarioRegistrado");
            if (!usuarioGuardado) throw new Error("Usuario no registrado");

            const usuario = JSON.parse(usuarioGuardado);
            if (!usuario._id) throw new Error("ID de usuario no encontrado");

            const response = await fetch(`http://${location.hostname}:3001/users/${usuario._id}/favoritos`);
            if (!response.ok) throw new Error("Error al obtener favoritos");

            const favoritos = await response.json();
            console.log("✅ Favoritos obtenidos:", favoritos);
            renderizarListaFavoritos(favoritos);
        } catch (error) {
            console.error("❌ Error al cargar favoritos:", error);
        }
    }

    /**
     * 📌 Renderiza la lista de favoritos y permite enviar mensajes desde ahí.
     * @param {Array<{_id: string, nombre: string, descripcion: string}>} favoritos 
     */
    async function renderizarListaFavoritos(favoritos) {
        if (!favoritosList) {
            console.error("❌ No se encontró el contenedor de favoritos.");
            return;
        }

        favoritosList.innerHTML = favoritos.length ? "" : "<p>No tienes favoritos aún.</p>";

        favoritos.forEach(servicio => {
            const favoritoItem = document.createElement("div");
            favoritoItem.classList.add("favorito-item");
            favoritoItem.innerHTML = `
                <p><strong>${servicio.nombre}</strong></p>
                <p>${servicio.descripcion}</p>
                <button class="btn-mensaje" data-servicio-id="${servicio._id}">Enviar Mensaje</button>
            `;

            favoritosList.appendChild(favoritoItem);
        });

        // 📌 Añadir eventos para iniciar chat desde favoritos
        document.querySelectorAll(".btn-mensaje").forEach(async (btn) => {
            btn.addEventListener("click", async () => {
                const servicioId = btn.getAttribute("data-servicio-id");
                if (!servicioId) return;

            
                // Luego en el event listener:
                abrirChat(servicioId);
            });
        });

        console.log("✅ Favoritos renderizados en la UI.");
    }

    cargarFavoritos();
});
