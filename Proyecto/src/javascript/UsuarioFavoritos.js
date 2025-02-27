//@ts-check
import {abrirChat} from "./UsuarioMensajes.js"; 
const API_PORT = location.port ? `:${location.port}` : ''

document.addEventListener("DOMContentLoaded", () => {
    console.log("📌 Cargando módulo de favoritos...");

    const favoritosList = document.getElementById("favoritos-list");

    let usuario = JSON.parse(localStorage.getItem("usuarioRegistrado") || "{}");

    if (!usuario._id) {
        console.error("❌ No se encontró el ID del usuario.");
        return;
      }
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
            mostrarServiciosRecomendados();

        } catch (error) {
            console.error("❌ Error al cargar favoritos:", error);
        }
    }/**
     * 📌 Escuchar evento para actualizar favoritos dinámicamente
     */
    document.addEventListener("favoritos-actualizados", () => {
        console.log("📌 Evento 'favoritos-actualizados' recibido. Recargando lista...");
        cargarFavoritos();
        mostrarServiciosRecomendados(); // Recargamos los servicios recomendados

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
            mostrarServiciosRecomendados(); // Recargamos los servicios recomendados

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



    //LiSTA
  // Mostrar servicios recomendados basados en los favoritos

    async function mostrarServiciosRecomendados() {
        const serviciosRecomendadosList = document.getElementById("servicios-recomendados-list");

        if (!serviciosRecomendadosList) {
            console.error("❌ No se encontró el contenedor de servicios recomendados.");
            return;
        }

        fetch(`${location.protocol}//${location.hostname}${API_PORT}/read/servicios`)
            .then(response => response.json())
            .then(servicios => {
                // Filtramos los servicios recomendados basados en la categoría de los favoritos
                const serviciosAleatorios = obtenerServiciosAleatorios(servicios, 3);

                // Mostrar solo los primeros 3 servicios recomendados
           

                if (serviciosAleatorios.length > 0) {
                    serviciosRecomendadosList.innerHTML = serviciosAleatorios.map(servicio => {
                        return `<div class="servicio-recomendado">
                            <p>${servicio.nombre}</p>
                            <button class="btn-agregar-favorito" data-servicio-id="${servicio._id}">Add </button>
                        </div>`;
                    }).join('');
                } else {
                    serviciosRecomendadosList.innerHTML = "<p>No hay servicios recomendados disponibles.</p>";
                }

                // Evento para añadir a favoritos
                document.querySelectorAll(".btn-agregar-favorito").forEach(btn => {
                    btn.addEventListener("click", async () => {
                        const servicioId = btn.getAttribute("data-servicio-id");
                        if (!servicioId) return;

                        console.log(`📌 Agregando servicio ID: ${servicioId} a favoritos`);
                        await agregarAFavoritos(usuario._id, servicioId, "Nuevo Servicio"); // Cambiar nombre si es necesario
                    });
                });
            })
            .catch(error => {
                console.error("❌ Error al cargar los servicios recomendados:", error);
            });
    }
        /**
         * Función para obtener un número aleatorio de servicios de la lista
         * @param {Array} servicios - Lista de todos los servicios disponibles
         * @param {number} cantidad - Número de servicios aleatorios que queremos mostrar
         * @returns {Array} - Un array con los servicios seleccionados aleatoriamente
         */
        function obtenerServiciosAleatorios(servicios, cantidad) {
            const serviciosCopiados = [...servicios]; // Crear una copia de la lista de servicios
            const serviciosAleatorios = [];
            for (let i = 0; i < cantidad; i++) {
                // Seleccionamos un índice aleatorio de la lista
                const indiceAleatorio = Math.floor(Math.random() * serviciosCopiados.length);
                serviciosAleatorios.push(serviciosCopiados[indiceAleatorio]);

                // Eliminar el servicio seleccionado para evitar repetirlo
                serviciosCopiados.splice(indiceAleatorio, 1);
            }
            return serviciosAleatorios;
        }
    // Agregar un servicio a favoritos
    async function agregarAFavoritos(usuarioId, servicioId, nombreServicio) {
        console.log(`📌 Agregando a favoritos el servicio ${nombreServicio}...`);
        fetch(`${location.protocol}//${location.hostname}${API_PORT}/users/${usuarioId}/favoritos/${servicioId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            cargarFavoritos(); // Actualizamos la lista de favoritos
            mostrarServiciosRecomendados(); // Recargamos los servicios recomendados
        })
        .catch(error => {
            console.error("❌ Error al agregar a favoritos:", error);
        });
    }

    // Botón para refrescar la lista de servicios recomendados
    const btnRefrescar = document.getElementById("btn-refrescar");
    if (btnRefrescar) {
        btnRefrescar.addEventListener("click", () => {
            mostrarServiciosRecomendados();
        });
    }
    cargarFavoritos();
});