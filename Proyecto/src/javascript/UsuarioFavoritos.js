//@ts-check
import {abrirChat} from "./UsuarioMensajes.js"; 
const API_PORT = location.port ? `:${location.port}` : ''

document.addEventListener("DOMContentLoaded", () => {
    console.log("📌 Cargando módulo de favoritos...");

    const favoritosList = document.getElementById("favoritos-list");

    async function cargarFavoritos() {
        try {
            const usuarioGuardado = localStorage.getItem("usuarioRegistrado");
            if (!usuarioGuardado) throw new Error("Usuario no registrado");

            const usuario = JSON.parse(usuarioGuardado);
            if (!usuario._id) throw new Error("ID de usuario no encontrado");

            const response = await fetch(`${location.protocol}//${location.hostname}${API_PORT}/users/${usuario._id}/favoritos`);
            if (!response.ok) throw new Error("Error al obtener favoritos");

            const favoritos = await response.json();
            console.log("✅ Favoritos obtenidos:", favoritos);
            renderizarListaFavoritos(favoritos);
        } catch (error) {
            console.error("❌ Error al cargar favoritos:", error);
        }
    }/**
     * 📌 Escuchar evento para actualizar favoritos dinámicamente
     */
    document.addEventListener("favoritos-actualizados", () => {
        console.log("📌 Evento 'favoritos-actualizados' recibido. Recargando lista...");
        cargarFavoritos();
    });

    cargarFavoritos();

   
    /**
     * 📌 Renderiza la lista de favoritos y permite eliminarlos.
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
                <button class="btn-eliminar" data-servicio-id="${servicio._id}">Eliminar</button>
                <button class="btn-mensaje" data-servicio-id="${servicio._id}">Enviar Mensaje</button>
            `;

            favoritosList.appendChild(favoritoItem);
        });

        // 📌 Evento para eliminar favoritos
        document.querySelectorAll(".btn-eliminar").forEach(btn => {
            btn.addEventListener("click", async () => {
                const servicioId = btn.getAttribute("data-servicio-id");
                if (!servicioId) return;

                console.log(`📌 Intentando eliminar favorito con ID: ${servicioId}`);

                try {
                    const usuarioGuardado = localStorage.getItem("usuarioRegistrado");
                    const usuario = JSON.parse(usuarioGuardado || "{}");

                    const response = await fetch(`${location.protocol}//${location.hostname}${API_PORT}/users/${usuario._id}/favoritos/${servicioId}`, {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json" }
                    });

                    if (!response.ok) throw new Error(`Error al eliminar favorito (${response.status})`);

                    console.log(`✅ Favorito ${servicioId} eliminado correctamente.`);
                    await cargarFavoritos(); 

                } catch (error) {
                    console.error("❌ Error al eliminar favorito:", error);
                }
            });
        });

        // 📌 Evento para enviar un mensaje al servicio desde favoritos
        document.querySelectorAll(".btn-mensaje").forEach(btn => {
            btn.addEventListener("click", async () => {
                const servicioId = btn.getAttribute("data-servicio-id");
                if (!servicioId) return;

                console.log(`📌 Enviando mensaje al servicio ID: ${servicioId}`);
                
                abrirChat(servicioId); // 🛠️ Usa la función de UsuarioMensajes.js
            });
        });

        console.log("✅ Favoritos renderizados en la UI.");
    }

    cargarFavoritos();
});