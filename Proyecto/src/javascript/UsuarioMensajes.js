//@ts-check
async function cargarMensajes() {
    try {
        const usuarioGuardado = localStorage.getItem("usuarioRegistrado");
        if (!usuarioGuardado) throw new Error("Usuario no registrado");

        const usuario = JSON.parse(usuarioGuardado);
        if (!usuario._id) throw new Error("ID de usuario no encontrado");

        console.log(`📌 Buscando mensajes para el usuario: ${usuario._id}`);

        // Hacer la petición al backend para obtener los mensajes
        const response = await fetch(`http://${location.hostname}:3001/mensajes?usuarioId=${usuario._id}`);

        if (!response.ok) throw new Error(`Error al obtener mensajes (${response.status})`);

        const mensajes = await response.json();
        console.log("✅ Mensajes obtenidos:", mensajes);

        // Renderizar los mensajes en la UI
        renderizarMensajes(mensajes);

    } catch (error) {
        console.error("❌ Error al cargar mensajes:", error);
    }
}

/**
 * @param {any[]} mensajes
 */
function renderizarMensajes(mensajes) {
    const chatList = document.getElementById("chat-list");
    
    if (!chatList) {
        console.error("❌ No se encontró el contenedor de mensajes.");
        return;
    }

    console.log("🔍 Intentando renderizar mensajes...");
    
    // Si no hay mensajes, mostrar un mensaje de "No hay chats"
    if (mensajes.length === 0) {
        chatList.innerHTML = "<p>No hay chats aún.</p>";
        console.warn("⚠ No hay mensajes para mostrar.");
        return;
    }

    chatList.innerHTML = ""; // Limpiar la lista antes de agregar nuevos mensajes

    mensajes.forEach((msg) => {
        const mensajeItem = document.createElement("div");
        mensajeItem.classList.add("mensaje-item");

        // Construir el contenido del mensaje con nombre de usuario y fecha
        mensajeItem.innerHTML = `
            <p><strong>${msg.usuarioId}</strong>: ${msg.contenido}</p>
            <span class="fecha">${new Date(msg.fecha).toLocaleString()}</span>
        `;

        chatList.appendChild(mensajeItem);
    });

    console.log("✅ Mensajes renderizados en la UI.");
}



// Llamar a la función cuando se cargue la página
document.addEventListener("DOMContentLoaded", cargarMensajes);
