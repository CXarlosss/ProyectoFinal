//@ts-check

const API_PORT = location.port ? `:${location.port}` : '';

document.addEventListener("DOMContentLoaded", () => {
    const btnCerrarChat = document.getElementById("cerrar-chat");
    const btnEnviarMensaje = document.getElementById("enviar-mensaje");
    const chatPopup = document.getElementById("chat-popup");

    if (!chatPopup) {
        console.error("❌ No se encontró #chat-popup en el DOM.");
        return;
    }

    if (btnCerrarChat) btnCerrarChat.addEventListener("click", cerrarChat);
    if (btnEnviarMensaje) btnEnviarMensaje.addEventListener("click", enviarMensaje);

    // Si hay un chat guardado, abrirlo
    const chatActivo = localStorage.getItem("chatActivo");
    if (chatActivo) {
        abrirChat(chatActivo);
    }
});

/**
 * 📌 Carga los mensajes del chat activo
 */
async function cargarMensajes() {
    try {
        const usuarioGuardado = localStorage.getItem("usuarioRegistrado");
        if (!usuarioGuardado) throw new Error("Usuario no registrado");

        const usuario = JSON.parse(usuarioGuardado);
        if (!usuario._id) throw new Error("ID de usuario no encontrado");

        const chatId = localStorage.getItem("chatActivo"); // 🔹 Obtener el chat activo
        if (!chatId) return;

        console.log(`📌 Cargando mensajes del chat: ${chatId}`);

        const response = await fetch(`${location.protocol}//${location.hostname}${API_PORT}/api/mensajes?chatId=${chatId}`, {
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) throw new Error(`Error al obtener mensajes (${response.status})`);

        const mensajes = await response.json();
        console.log("✅ Mensajes obtenidos:", mensajes);

        renderizarChat(mensajes, usuario._id);

    } catch (error) {
        console.error("❌ Error al cargar mensajes:", error);
    }
}

/**
 * 📌 Renderiza los mensajes del chat activo.
 * @param {any[]} mensajes
 * @param {string} usuarioId
 */
function renderizarChat(mensajes, usuarioId) {
    const chatMessages = document.getElementById("chat-messages");
    if (!chatMessages) {
        console.error("❌ No se encontró el contenedor de mensajes.");
        return;
    }

    chatMessages.innerHTML = "";

    if (mensajes.length === 0) {
        chatMessages.innerHTML = "<p>No hay mensajes en este chat.</p>";
        return;
    }

    mensajes.forEach(msg => {
        const esMio = msg.usuarioId === usuarioId;
        const msgElement = document.createElement("div");
        msgElement.classList.add("mensaje", esMio ? "mio" : "otro");
        msgElement.innerHTML = `
            <p><strong>${esMio ? "Tú" : "Otro"}:</strong> ${msg.contenido}</p>
            <span class="fecha">${new Date(msg.fecha).toLocaleString()}</span>
        `;
        chatMessages.appendChild(msgElement);
    });

    console.log("✅ Chat renderizado en la UI.");
}

/**
 * 📌 Abre un chat específico y muestra los mensajes.
 * @param {string} contactoId 
 */
export async function abrirChat(contactoId) {
    console.log(`📌 Abriendo chat con ID: ${contactoId}`);

    const chatPopup = document.getElementById("chat-popup");
    const chatTitulo = document.getElementById("chat-titulo");
    const chatMessages = document.getElementById("chat-messages");

    if (!chatPopup || !chatMessages || !chatTitulo) return;

    chatPopup.classList.add("active");
    chatTitulo.dataset.contactoId = contactoId;

    // Guardar el chat activo en localStorage
    localStorage.setItem("chatActivo", contactoId);

    chatMessages.innerHTML = "<p>Cargando mensajes...</p>";

    try {
        await cargarMensajes();
    } catch (error) {
        console.error("❌ Error al abrir el chat:", error);
    }
}

/**
 * 📌 Cierra el chat activo.
 */
function cerrarChat() {
    const chatPopup = document.getElementById("chat-popup");
    console.log("📌 Cerrando el chat...");
    chatPopup?.classList.remove("active");

    // Eliminar el chat activo de localStorage
    localStorage.removeItem("chatActivo");
}

/**
 * 📌 Envía un mensaje al chat activo.
 */
async function enviarMensaje() {
    const mensajeInput = /** @type {HTMLInputElement} */ (document.getElementById("mensaje-input"));
    const chatTitulo = /** @type {HTMLInputElement} */ (document.getElementById("chat-titulo"));

    if (!mensajeInput || !chatTitulo) return;

    const mensajeTexto = mensajeInput.value.trim();
    if (!mensajeTexto) {
        console.warn(" No se puede enviar un mensaje vac o.");
        return;
    }

    try {
        const usuarioGuardado = localStorage.getItem("usuarioRegistrado");
        if (!usuarioGuardado) throw new Error("Usuario no registrado");

        const usuario = JSON.parse(usuarioGuardado);
        if (!usuario._id) throw new Error("ID de usuario no encontrado");

        const contactoId = chatTitulo.dataset.contactoId || null;
        if (!contactoId) throw new Error("No se ha seleccionado un chat válido");

        console.log("📌 Enviando mensaje...");
        console.log("Usuario ID:", usuario._id);
        console.log("Destino ID:", contactoId);
        console.log("Contenido:", mensajeTexto);

        const response = await fetch(`${location.protocol}//${location.hostname}${API_PORT}/api/mensajes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                usuarioId: usuario._id,
                receptorId: contactoId, // Ahora se envía correctamente
                contenido: mensajeTexto,
                leido: false
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error al enviar mensaje (${response.status}): ${errorText}`);
        }

        console.log("✅ Mensaje enviado correctamente.");
        mensajeInput.value = "";
        await cargarMensajes();

    } catch (error) {
        console.error("❌ Error al enviar mensaje:", error);
    }
}
