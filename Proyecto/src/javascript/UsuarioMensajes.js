//@ts-check
document.addEventListener("DOMContentLoaded", () => {
    cargarMensajes();
    const btnCrearChat = document.getElementById("btn-create-chat");
    const btnCerrarChat = document.getElementById("cerrar-chat");
    const btnEnviarMensaje = document.getElementById("enviar-mensaje");
    const chatPopup = document.getElementById("chat-popup");
    
    if (!chatPopup) {
        console.error("❌ No se encontró #chat-popup en el DOM.");
        return;
    }
 
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

   /** @type {Record<string, { id: string, nombre: string, ultimoMensaje: string, fecha: string }>} */
const chats = {};


    mensajes.forEach(msg => {
        const contactoId = msg.usuarioId === usuarioId ? msg.servicioId : msg.usuarioId;
        const contactoNombre = msg.usuarioId === usuarioId ? "Servicio" : "Usuario";

    
    
        if (!chats[contactoId]) {
            chats[contactoId] = {
                id: contactoId,
                nombre: contactoNombre || "Desconocido",
                ultimoMensaje: msg.contenido,
                fecha: new Date(msg.fecha).toLocaleString()
            };
        }
    });

    Object.values(chats).forEach(chat => {
        const chatItem = document.createElement("div");
        chatItem.classList.add("chat-item");
        chatItem.innerHTML = `
            <p><strong>${chat.nombre}</strong></p> <!-- Aquí se muestra el nombre -->
            <p>${chat.ultimoMensaje}</p>
            <span class="fecha">${chat.fecha}</span>
        `;
        chatItem.addEventListener("click", () => abrirChat(chat.id));
        chatList.appendChild(chatItem);
    });

    console.log("✅ Chats renderizados en la UI.");
}


/**
 * 📌 Abre un chat específico y muestra los mensajes.
 * @param {string} contactoId 
 */
export async function abrirChat(contactoId) {
    console.log(`📌 Intentado Abrir el chat con ID: ${contactoId}`);

    const chatPopup = document.getElementById("chat-popup");
    const chatMessages = document.getElementById("chat-messages");
    const chatTitulo = document.getElementById("chat-titulo");
    const mensajeInput = /** @type {HTMLInputElement | null} */ (document.getElementById("mensaje-input"));

    if (!chatPopup || !chatMessages || !chatTitulo || !mensajeInput) return;

    chatPopup.classList.add("active");
    chatTitulo.dataset.contactoId = contactoId;
    chatMessages.innerHTML = "<p>Cargando mensajes...</p>";

    try {
        const usuarioGuardado = localStorage.getItem("usuarioRegistrado");
        const usuario = JSON.parse(usuarioGuardado || "{}");

        const response = await fetch(`http://${location.hostname}:3001/mensajes?usuarioId=${usuario._id}&servicioId=${contactoId}`);

        if (!response.ok) throw new Error(`Error al obtener mensajes (${response.status})`);

        const mensajes = await response.json();
        chatMessages.innerHTML = "";

        mensajes.forEach((/** @type {{ usuarioId: any; contenido: any; fecha: string | number | Date; _id: any; }} */ msg) => {
            const msgElement = document.createElement("div");
            msgElement.classList.add("mensaje");
            msgElement.innerHTML = `
                <p><strong>${msg.usuarioId === usuario._id ? "Tú" : "Otro"}:</strong> ${msg.contenido}</p>
                <span class="fecha">${new Date(msg.fecha).toLocaleString()}</span>
                <button class="btn-responder" data-mensaje-id="${msg._id}">Responder</button>
            `;

            const responderBtn = msgElement.querySelector(".btn-responder");
            if (responderBtn) {
                responderBtn.addEventListener("click", () => {
                    mensajeInput.value = `@${msg.usuarioId}: ${msg.contenido} `;
                    mensajeInput.focus();
                });
            }

            chatMessages.appendChild(msgElement);
        });

    } catch (error) {
        console.error("❌ Error al cargar mensajes del chat:", error);
    }
}

// ✅ Exportamos abrirChat como función exportada


function cerrarChat() {
    const chatPopup = document.getElementById("chat-popup");
    console.log("📌 Cerrando el chat...");
    chatPopup?.classList.remove("active");

}

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

        // 📌 DEBUG: Verificar qué datos se envían
        console.log("📌 Enviando mensaje con:");
        console.log("Usuario ID:", usuario._id);
        console.log("Servicio ID:", servicioId);
        console.log("Contenido:", mensajeTexto);

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

        if (!response.ok) throw new Error(`Error al enviar mensaje (${response.status})`);

        console.log("✅ Mensaje enviado correctamente.");
        mensajeInput.value = ""; 
        await cargarMensajes();

    } catch (error) {
        console.error("❌ Error al enviar mensaje:", error);
    }
}

function abrirFormularioNuevoChat() {
    const nuevoChat = prompt("Introduce el ID del servicio o usuario con el que quieres chatear:");
    if (nuevoChat) abrirChat(nuevoChat);
}
