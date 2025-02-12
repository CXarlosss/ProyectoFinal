//@ts-check
document.addEventListener("DOMContentLoaded", () => {
    cargarMensajes();
    const btnCrearChat = document.getElementById("btn-create-chat");
    const btnCerrarChat = document.getElementById("cerrar-chat");
    const btnEnviarMensaje = document.getElementById("enviar-mensaje");

    if (btnCrearChat) btnCrearChat.addEventListener("click", abrirFormularioNuevoChat);
    if (btnCerrarChat) btnCerrarChat.addEventListener("click", cerrarChat);
    if (btnEnviarMensaje) btnEnviarMensaje.addEventListener("click", enviarMensaje);
});

/**
 * Carga los mensajes del usuario desde el servidor.
 */
async function cargarMensajes() {
    try {
        const usuarioGuardado = localStorage.getItem("usuarioRegistrado");
        if (!usuarioGuardado) throw new Error("Usuario no registrado");

        /** @type {{_id: string}} */
        const usuario = JSON.parse(usuarioGuardado);
        if (!usuario._id) throw new Error("ID de usuario no encontrado");

        console.log(`📌 Buscando mensajes para el usuario: ${usuario._id}`);

        const response = await fetch(`http://${location.hostname}:3001/mensajes?usuarioId=${usuario._id}`);

        if (!response.ok) throw new Error(`Error al obtener mensajes (${response.status})`);

        /** @type {Array<{usuarioId: string, servicioId: string, contenido: string, fecha: string, leido: boolean}>} */
        const mensajes = await response.json();
        console.log("✅ Mensajes obtenidos:", mensajes);

        renderizarListaChats(mensajes, usuario._id);

    } catch (error) {
        console.error("❌ Error al cargar mensajes:", error);
    }
}

/**
 * Renderiza la lista de chats en la UI.
 * @param {Array<{usuarioId: string, servicioId: string, contenido: string, fecha: string, leido: boolean}>} mensajes 
 * @param {string} usuarioId
 */
function renderizarListaChats(mensajes, usuarioId) {
    const chatList = document.getElementById("chat-list");
    if (!chatList) {
        console.error("❌ No se encontró el contenedor de mensajes.");
        return;
    }

    chatList.innerHTML = ""; 

    if (mensajes.length === 0) {
        chatList.innerHTML = "<p>No hay chats aún.</p>";
        return;
    }

    /** @type {Record<string, { id: string, ultimoMensaje: string, fecha: string }>} */
    const chats = {};

    mensajes.forEach(msg => {
        const contactoId = msg.usuarioId === usuarioId ? msg.servicioId : msg.usuarioId;
        if (!chats[contactoId]) {
            chats[contactoId] = {
                id: contactoId,
                ultimoMensaje: msg.contenido,
                fecha: new Date(msg.fecha).toLocaleString()
            };
        }
    });

    Object.values(chats).forEach(chat => {
        const chatItem = document.createElement("div");
        chatItem.classList.add("chat-item");
        chatItem.innerHTML = `
            <p><strong>Chat con ID: ${chat.id}</strong></p>
            <p>${chat.ultimoMensaje}</p>
            <span class="fecha">${chat.fecha}</span>
        `;
        chatItem.addEventListener("click", () => abrirChat(chat.id));
        chatList.appendChild(chatItem);
    });

    console.log("✅ Chats renderizados en la UI.");
}

/**
 * Abre un chat específico y muestra los mensajes.
 * @param {string} contactoId 
 */
async function abrirChat(contactoId) {
    const chatPopup = document.getElementById("chat-popup");
    const chatMessages = document.getElementById("chat-messages");
    const chatTitulo = document.getElementById("chat-titulo");

    if (!chatPopup || !chatMessages || !chatTitulo) return;

    chatPopup.classList.remove("hidden");
    chatTitulo.dataset.contactoId = contactoId;
    chatMessages.innerHTML = "<p>Cargando mensajes...</p>";

    try {
        const usuarioGuardado = localStorage.getItem("usuarioRegistrado");
        const usuario = JSON.parse(usuarioGuardado || "{}");

        const response = await fetch(`http://${location.hostname}:3001/mensajes?usuarioId=${usuario._id}&servicioId=${contactoId}`);

        if (!response.ok) throw new Error(`Error al obtener mensajes (${response.status})`);

        /** @type {Array<{usuarioId: string, servicioId: string, contenido: string, fecha: string, leido: boolean}>} */
        const mensajes = await response.json();
        chatMessages.innerHTML = "";

        mensajes.forEach(msg => {
            const msgElement = document.createElement("div");
            msgElement.classList.add("mensaje");
            msgElement.innerHTML = `
                <p><strong>${msg.usuarioId === usuario._id ? "Tú" : "Otro"}:</strong> ${msg.contenido}</p>
                <span class="fecha">${new Date(msg.fecha).toLocaleString()}</span>
            `;
            chatMessages.appendChild(msgElement);
        });

    } catch (error) {
        console.error("❌ Error al cargar mensajes del chat:", error);
    }
}

/**
 * Cierra el chat actual.
 */
function cerrarChat() {
    const chatPopup = document.getElementById("chat-popup");
    if (chatPopup) chatPopup.classList.add("hidden");
}

/**
 * Envía un mensaje dentro del chat abierto.
 */
async function enviarMensaje() {
    const mensajeInput = /** @type {HTMLInputElement | null} */ (document.getElementById("mensaje-input"));
    const chatTitulo = document.getElementById("chat-titulo");

    if (!mensajeInput || !chatTitulo) return;

    const mensajeTexto = mensajeInput.value.trim().replace(/<[^>]*>/g, ""); // Sanitize input to prevent XSS
    if (!mensajeTexto) return;

    try {
        const usuarioGuardado = localStorage.getItem("usuarioRegistrado");
        const usuario = JSON.parse(usuarioGuardado || "{}");
        const servicioId = chatTitulo.dataset.contactoId;

        const response = await fetch(`http://${location.hostname}:3001/mensajes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                usuarioId: usuario._id,
                servicioId,
                contenido: mensajeTexto,
                leido: false
            })
        });

        if (!response.ok) throw new Error("Error al enviar mensaje");

        mensajeInput.value = ""; // ✅ Ahora funciona sin errores
        await cargarMensajes();

    } catch (error) {
        console.error("❌ Error al enviar mensaje:", error);
    }
}

/**
 * Abre un formulario para iniciar un nuevo chat.
 */
function abrirFormularioNuevoChat() {
    const nuevoChat = prompt("Introduce el ID del servicio o usuario con el que quieres chatear:");
    if (nuevoChat) abrirChat(nuevoChat);
}
