// @ts-check

document.addEventListener("DOMContentLoaded", () => {
   
    const servicioContainer =  /** @type {HTMLDivElement | null} */document.getElementById("servicio-container");

    if (!servicioContainer) {
        console.error("❌ No se encontró el contenedor de servicio en el DOM.");
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const servicioId = urlParams.get("id");

    if (!servicioId) {
        servicioContainer.innerHTML = "<p>❌ Servicio no encontrado.</p>";
        return;
    }

    /**
     * Carga un servicio desde localStorage y lo muestra en la interfaz.
     */
    function cargarServicioDesdeLocalStorage() {
        /** @type {string | null} */
        const serviciosString = localStorage.getItem("servicios");

        if (!serviciosString || serviciosString === "[]") {
            console.warn("⚠️ No hay servicios en LocalStorage. Esperando...");
            setTimeout(cargarServicioDesdeLocalStorage, 1000);
            return;
        }

        /** @type {Array<{ id: string, nombre: string, descripcion: string, ubicacion: string, valoracion?: string, precio?: number, horarios?: string, metodoPago?: string, etiquetas?: string, emailUsuario?: string, imagen?: string }>} */
        const servicios = JSON.parse(serviciosString);
        
        /** @type {typeof servicios[0] | undefined} */
        const servicio = servicios.find(serv => {
            console.log(serv.id.toString());
            return serv.id.toString() === servicioId;

        });
        console.log("📌 Servicio obtenido de LocalStorage:", servicios);
        console.log("📌 Buscando servicio con ID:", servicioId);
        console.log("📌 Servicio encontrado:", servicio);

        if (!servicio) {
            servicioContainer && (servicioContainer.innerHTML = `
                <div class="error-message">
                    <p>❌ El servicio con ID <code>${servicioId}</code> no se encuentra en la lista de servicios.</p>
                    <p>Por favor, verifica el ID o vuelve a la lista de servicios.</p>
                </div>
            `);
            return;
        }

        servicioContainer && (servicioContainer.innerHTML = `
            <div class="servicio-info">
                <h2>${servicio.nombre}</h2>
                <p><strong>Descripción:</strong> ${servicio.descripcion}</p>
                <p><strong>Ubicación:</strong> ${servicio.ubicacion}</p>
                <p><strong>Valoración:</strong> ${servicio.valoracion || "No valorado"}</p>
                <p><strong>Precio:</strong> ${servicio.precio ? `$${servicio.precio}` : "No especificado"}</p>
                <p><strong>Horarios:</strong> ${servicio.horarios || "No disponible"}</p>
                <p><strong>Método de Pago:</strong> ${servicio.metodoPago || "No especificado"}</p>
                <p><strong>Etiquetas:</strong> ${servicio.etiquetas || "No definidas"}</p>
                <p><strong>Contacto:</strong> <a href="mailto:${servicio.emailUsuario}">${servicio.emailUsuario || "No disponible"}</a></p>
                <button id="btn-ir-chat">Enviar Mensaje</button>
                <button id="btn-volver">⬅️ Volver a Servicios</button>
            </div>
            <div class="servicio-imagen">
                <img src="${servicio.imagen || 'default.jpg'}" alt="Imagen del servicio">
            </div>
        `);

        
        const btnIrChat =/** @type {HTMLButtonElement | null} */ document.getElementById("btn-ir-chat");

       
        const btnVolver =  /** @type {HTMLButtonElement | null} */document.getElementById("btn-volver") ;

        if (btnIrChat) {
            btnIrChat.addEventListener("click", () => {
                // 📌 Guardamos el servicio actual en localStorage para que esté disponible en la página de usuario
                localStorage.setItem("servicioSeleccionado", JSON.stringify(servicio));

                // Redirigir a la página del usuario con el ID del servicio en la URL
                window.location.href = `paginadelusuario.html?servicioId=${encodeURIComponent(servicio.id)}`;
            });
        }

        if (btnVolver) {
            btnVolver.addEventListener("click", () => {
                window.location.href = `servicios.html`;
            });
        }
    }

    cargarServicioDesdeLocalStorage();
});
