//@ts-check

const API_PORT = location.port ? `:${location.port}` : ''
document.addEventListener("DOMContentLoaded", () => {
    

   /*  cargarMensajes(); */
   /*  setInterval(cargarMensajes, 5000); // Recarga los mensajes cada 5 segundos */

    const btnCerrarChat = document.getElementById("cerrar-chat");
    const btnEnviarMensaje = document.getElementById("enviar-mensaje");
    const chatPopup = document.getElementById("chat-popup");
    
    if (!chatPopup) {
        console.error("❌ No se encontró #chat-popup en el DOM.");
        return;
    }
 

    if (btnCerrarChat) btnCerrarChat.addEventListener("click", cerrarChat);
    if (btnEnviarMensaje) btnEnviarMensaje.addEventListener("click", enviarMensaje);
    const servicioGuardado = localStorage.getItem("servicioSeleccionado");
    if (servicioGuardado) {
        const servicio = JSON.parse(servicioGuardado);
        abrirChat(servicio._id);
        localStorage.removeItem("servicioSeleccionado"); // 🔥 Limpiamos después de usarlo
    }

    
});

async function cargarMensajes() {
    try {
        const usuarioGuardado = localStorage.getItem("usuarioRegistrado");
            if (!usuarioGuardado) {
                console.error("❌ Usuario no registrado en localStorage");
                return;
            }
            const usuario = JSON.parse(usuarioGuardado);

        if (!usuario._id) throw new Error("ID de usuario no encontrado");

        console.log(`📌 Buscando mensajes para el usuario: ${usuario._id}`);

        const chatId = localStorage.getItem("chatActivo");
        if (!chatId) {
                console.warn("⚠ No hay chat activo seleccionado.");
            return;
        }


        const response = await fetch(`${location.protocol}//${location.hostname}${API_PORT}/api/mensajes?chatId=${chatId}`, {
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) throw new Error(`Error al obtener mensajes (${response.status})`);

        const mensajes = await response.json();
        console.log("✅ Mensajes obtenidos:", mensajes);

        renderizarListaChats(mensajes, usuario._id);

    } catch (error) {
        console.error("❌ Error al cargar mensajes:", error);
    }
}



/**
 * Renderiza la lista de chats en la UI.
 * 📌 Renderiza la lista de chats en la UI.
 * @param {any[]} mensajes
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
        chatList.innerHTML = "<p>No tienes chats aún.</p>";
        return;
    }

    /** @type {Record<string, { id: string, nombre: string, ultimoMensaje: string, fecha: string }>} */
    const chats = {};

    mensajes.forEach((/** @type {{ usuarioId: any; servicioId: any; servicio: { nombre: any; }; usuario: { nombre: any; }; contenido: any; fecha: string | number | Date; }} */ msg) => {
        const contactoId = msg.usuarioId === usuarioId ? msg.servicioId : msg.usuarioId;
        const contactoNombre = msg.usuarioId === usuarioId ? msg.servicio?.nombre || "Servicio" : msg.usuario?.nombre || "Usuario";

        if (!chats[contactoId]) {
            chats[contactoId] = {
                id: contactoId,
                nombre: contactoNombre,
                ultimoMensaje: msg.contenido,
                fecha: new Date(msg.fecha).toLocaleString()
            };
        }
    });

    Object.values(chats).forEach(chat => {
        const chatItem = document.createElement("div");
        chatItem.classList.add("chat-item");
        chatItem.innerHTML = `
            <p><strong>${chat.nombre}</strong></p>
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
    console.log(`📌 Intentando abrir el chat con ID: ${contactoId}`);

    const chatPopup = document.getElementById("chat-popup");
    const chatMessages = document.getElementById("chat-messages");
    const chatTitulo = document.getElementById("chat-titulo");
    const mensajeInput = document.getElementById("mensaje-input");

    if (!chatPopup || !chatMessages || !chatTitulo || !mensajeInput) return;

    chatPopup.classList.add("active");
    chatTitulo.dataset.contactoId = contactoId;
    chatMessages.innerHTML = "<p>Cargando mensajes...</p>";

    try {
        const usuarioGuardado = localStorage.getItem("usuarioRegistrado");
        const usuario = JSON.parse(usuarioGuardado || "{}");

        const response = await fetch(`${location.protocol}//${location.hostname}${API_PORT}/api/mensajes?usuarioId=${usuario._id}`
);


        if (!response.ok) throw new Error(`Error al obtener mensajes (${response.status})`);

        const mensajes = await response.json();
        console.log("✅ Mensajes obtenidos:", mensajes);
        chatMessages.innerHTML = "";

        mensajes.forEach((/** @type {{ usuarioId: any; contenido: any; fecha: string | number | Date; }} */ msg) => {
            const esMio = msg.usuarioId === usuario._id;
            const msgElement = document.createElement("div");
            msgElement.classList.add("mensaje", esMio ? "mio" : "otro");
            msgElement.innerHTML = `
                <p><strong>${esMio ? "Tú" : "Otro"}:</strong> ${msg.contenido}</p>
                <span class="fecha">${new Date(msg.fecha).toLocaleString()}</span>
            `;
            chatMessages.appendChild(msgElement);
        });
        

    } catch (error) {
        console.error("❌ Error al cargar mensajes del chat:", error);
    }
}

function cerrarChat() {
    const chatPopup = document.getElementById("chat-popup");
    console.log("📌 Cerrando el chat...");
    chatPopup?.classList.remove("active");

}

async function enviarMensaje() {
    const mensajeInput = /** @type {HTMLInputElement | null} */ (document.getElementById("mensaje-input"));
    const chatTitulo = /** @type {HTMLElement | null} */ (document.getElementById("chat-titulo"));

    if (!mensajeInput || !chatTitulo) return;

    const mensajeTexto = mensajeInput.value.trim();
    if (!mensajeTexto) {
        console.warn("⚠ No se puede enviar un mensaje vacío.");
        return;
    }

    try {
        const usuarioGuardado = localStorage.getItem("usuarioRegistrado");
        const usuario = JSON.parse(usuarioGuardado || "{}");
        const contactoId = chatTitulo.dataset.contactoId || null; // Puede ser servicio o usuario

        console.log("📌 Enviando mensaje con:");
        console.log("Usuario ID:", usuario._id);
        console.log("Destino ID:", contactoId);
        console.log("Contenido:", mensajeTexto);

        // Detectar si el destino es un servicio o un usuario
        let isServicio = false;
        if (contactoId) {
            isServicio = await esUnServicio(contactoId).catch(() => false);
        }
        
        const response = await fetch(`${location.protocol}//${location.hostname}${API_PORT}/api/mensajes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                usuarioId: usuario._id,
                servicioId: isServicio ? contactoId : null,
                receptorId: !isServicio ? contactoId : null, // Si es usuario, se manda como receptorId
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

/**
 * 📌 Verifica si el ID pertenece a un servicio o a un usuario
 * @param {string} id 
 * @returns {Promise<boolean>} - `true` si es un servicio, `false` si es un usuario
 */
async function esUnServicio(id) {
    try {
        const response = await fetch(`${location.protocol}//${location.hostname}${API_PORT}/api/read/servicio/${id}`);
        return response.ok; // Si existe, es un servicio
    } catch {
        return false; // Si no existe, asumimos que es un usuario
    }
}
