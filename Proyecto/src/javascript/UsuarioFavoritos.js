//@ts-check

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
            renderizarFavoritos(favoritos);
        } catch (error) {
            console.error("❌ Error al cargar favoritos:", error);
        }
    }

    /**
     * @param {any[]} favoritos
     */
    /**
     * @param {Array<{ _id: string, nombre: string }>} favoritos
     */
    /**
     * 📌 Renderizar la lista de favoritos en la interfaz
     * @param {Array<{ _id: string, nombre: string }>} favoritos
     */
    function renderizarFavoritos(favoritos) {
        if (!favoritosList) return;
        
        favoritosList.innerHTML = favoritos.length ? "" : "<p>No tienes favoritos aún.</p>";

        favoritos.forEach((fav) => {
            const favItem = document.createElement("div");
            favItem.classList.add("favorito-item");
            favItem.setAttribute("data-id", fav._id);
            favItem.innerHTML = `
                <span>${fav.nombre}</span>  <!-- ✅ Aquí ya mostramos el nombre del servicio -->
                <button class="btn-eliminar-favorito" data-id="${fav._id}">❌</button>
            `;

            favoritosList.appendChild(favItem);
        });

        // 📌 Agregar eventos a los botones de eliminar
        document.querySelectorAll(".btn-eliminar-favorito").forEach((btn) => {
            btn.addEventListener("click", async (event) => {
                event.stopPropagation(); // Evita que el evento de clic se propague
                const servicioId = btn.getAttribute("data-id");
                if (servicioId) await eliminarFavorito(servicioId);
            });
        });

        console.log("✅ Favoritos renderizados en la UI.");
    }

    /**
     * @param {string} servicioId
     */
    async function eliminarFavorito(servicioId) {
        try {
            const usuarioGuardado = localStorage.getItem("usuarioRegistrado");
            if (!usuarioGuardado) throw new Error("Usuario no registrado");

            const usuario = JSON.parse(usuarioGuardado);
            if (!usuario._id) throw new Error("ID de usuario no encontrado");

            const response = await fetch(`http://${location.hostname}:3001/users/${usuario._id}/favoritos/${servicioId}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Error al eliminar de favoritos");

            console.log(`✅ Servicio ${servicioId} eliminado de favoritos`);
            await cargarFavoritos();
        } catch (error) {
            console.error("❌ Error al eliminar favorito:", error);
        }
    }

    cargarFavoritos();
});
