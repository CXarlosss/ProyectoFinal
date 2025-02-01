document.addEventListener("DOMContentLoaded", () => {
    const servicioContainer = document.getElementById("servicio-container");

    const urlParams = new URLSearchParams(window.location.search);
    const servicioId = urlParams.get("id");

    console.log("📌 ID recibido desde la URL:", servicioId); // 🚀 Depuración

    if (!servicioId) {
        servicioContainer.innerHTML = "<p>❌ Servicio no encontrado.</p>";
        return;
    }

    // 📌 Asegurar que hay servicios almacenados
    let servicios = localStorage.getItem("servicios");

    if (!servicios || servicios === "[]") {
        console.error("❌ No hay servicios guardados en LocalStorage.");
        servicioContainer.innerHTML = "<p>❌ Servicio no disponible.</p>";
        return;
    }

    servicios = JSON.parse(servicios);
    console.log("📌 Servicios obtenidos de LocalStorage:", servicios);

    const servicio = servicios.find(serv => serv.id == servicioId);
    console.log("📌 Servicio encontrado:", servicio);

    if (!servicio) {
        servicioContainer.innerHTML = "<p>❌ Servicio no disponible.</p>";
        return;
    }

    servicioContainer.innerHTML = `
        <div class="servicio-info">
            <h2>${servicio.nombre}</h2>
            <p><strong>Descripción:</strong> ${servicio.descripcion}</p>
            <p><strong>Ubicación:</strong> ${servicio.ubicacion}</p>
            <p><strong>Valoración:</strong> ${servicio.valoracion || "No valorado"}</p>
            <p><strong>Precio:</strong> ${servicio.precio ? `$${servicio.precio}` : "No especificado"}</p>
            <p><strong>Horarios:</strong> ${servicio.horarios || "No disponible"}</p>
            <p><strong>Método de Pago:</strong> ${servicio.metodoPago || "No especificado"}</p>
            <p><strong>Etiquetas:</strong> ${servicio.etiquetas || "No definidas"}</p>
            <p><strong>Contacto:</strong> <a href="mailto:${servicio.emailUsuario}">${servicio.emailUsuario}</a></p>
            <button id="btn-ir-chat">Enviar Mensaje</button>
        </div>
        <div class="servicio-imagen">
            <img src="${servicio.imagen || 'default.jpg'}" alt="Imagen del servicio">
        </div>
    `;

    document.getElementById("btn-ir-chat").addEventListener("click", () => {
        window.location.href = `paginadelusuario.html?servicio=${encodeURIComponent(servicioId)}`;
    });
});