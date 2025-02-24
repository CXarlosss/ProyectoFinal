//@ts-check

const API_PORT = location.port ? `:${location.port}` : '';
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
        console.log('Servicio-->', servicio)
        abrirChat(servicio._id);
        localStorage.removeItem("servicioSeleccionado"); // 🔥 Limpiamos después de usarlo
    }
    cargarMensajes();

    
});

async function cargarMensajes() {
    try {
        console.log("📌 Ejecutando cargarMensajes()...");
        const usuarioGuardado = localStorage.getItem("usuarioRegistrado");
        if (!usuarioGuardado) {
            console.error("❌ Usuario no registrado en localStorage");
            return;
        }
        const usuario = JSON.parse(usuarioGuardado);
        if (!usuario._id) throw new Error("ID de usuario no encontrado");

        console.log(`📌 Buscando mensajes para el usuario: ${usuario._id}`);

        const response = await fetch(`${location.protocol}//${location.hostname}${API_PORT}/read/mensajes`);

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
    console.log("📌 Ejecutando renderizarListaChats()...");
    console.log("📌 Datos recibidos en renderizarListaChats:", mensajes);
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

    /** @type {Record<string, { id: string, receptorId: string, nombre: string, ultimoMensaje: string, fecha: string }>} */
    const chats = {};

    mensajes.forEach((msg) => {
        // Agrupar por `chatId` en lugar de usuarioId o servicioId
        const chatId = msg.chatId;

        // Identificar el contacto correctamente (quién está al otro lado del chat)
        const contactoId = msg.usuarioId === usuarioId ? msg.receptorId : msg.usuarioId;

        // Nombre del contacto (Usuario o Servicio)
        const contactoNombre = msg.usuarioId === usuarioId ? "Servicio" : "Usuario";

        console.log('Mensaje-->', msg);
        
        if (!chats[chatId]) {
            chats[chatId] = {
                id: contactoId, // ID del contacto real
                receptorId: msg.receptorId,
                nombre: contactoNombre,
                ultimoMensaje: msg.contenido,
                fecha: new Date(msg.fecha).toLocaleString()
            };
        } else {
            // Si ya existe el chat, actualizamos el último mensaje
            chats[chatId].ultimoMensaje = msg.contenido;
            chats[chatId].fecha = new Date(msg.fecha).toLocaleString();
        }
    });

    Object.values(chats).forEach(chat => {
        const chatItem = document.createElement("div");
        console.log("📌 Renderizando chat:", chat);
        chatItem.classList.add("chat-item");
        chatItem.innerHTML = `
            <p><strong>${chat.nombre}</strong></p>
            <p>${chat.ultimoMensaje}</p>
            <span class="fecha">${chat.fecha}</span>
        `;

        if (chat.id) {
            chatItem.addEventListener("click", () => abrirChat(chat.id));
        } else {
            console.warn(`⚠ El chat con ${chat.nombre} no tiene un ID válido.`);
        }
        
        chatList.appendChild(chatItem);
    });

    console.log("✅ Chats renderizados en la UI.");
}



/**
 * 📌 Abre un chat específico y muestra los mensajes.
 * @param {string} contactoId 

 * 
 */
export async function abrirChat(contactoId) {
    console.log(`📌 Intentando abrir el chat con ID: ${contactoId}`);

    const chatPopup = document.getElementById("chat-popup");
    const chatMessages = document.getElementById("chat-messages");
    const chatTitulo = document.getElementById("chat-titulo");

    if (!chatPopup || !chatMessages || !chatTitulo) return;

    if (!contactoId) {
        console.error("❌ Error: contactoId es undefined o null. No se puede abrir el chat.");
        return;
    }

    chatPopup.classList.add("active");
    chatTitulo.dataset.contactoId = contactoId;
    chatMessages.innerHTML = "<p>Cargando mensajes...</p>";

    try {
        const usuarioGuardado = localStorage.getItem("usuarioRegistrado");
        const usuario = JSON.parse(usuarioGuardado || "{}");

        // 🛠 Obtener el nombre del contacto antes de cargar mensajes
        let nombreContacto = "Desconocido"; 

        // Intentamos obtener el nombre como servicio o usuario
        const servicioResponse = await fetch(`${location.protocol}//${location.hostname}${API_PORT}/read/servicio/${contactoId}`);
        if (servicioResponse.ok) {
            const servicioData = await servicioResponse.json();
            nombreContacto = servicioData.nombre || "Servicio"; 
        } else {
            // Si no es un servicio, buscamos en la colección de usuarios
            const usuarioResponse = await fetch(`${location.protocol}//${location.hostname}${API_PORT}/read/users`);
            if (usuarioResponse.ok) {
                const usuarios = await usuarioResponse.json();
                const usuarioEncontrado = usuarios.find(user => user._id === contactoId);
                if (usuarioEncontrado) {
                    nombreContacto = usuarioEncontrado.nombre || usuarioEncontrado.email || "Usuario";
                }
            }
        }

        // 🔥 MOSTRAR NOMBRE EN EL CHAT
        chatTitulo.innerHTML = `Chat con ${nombreContacto}`;

        // 📨 Obtener los mensajes del chat
        const response = await fetch(`${location.protocol}//${location.hostname}${API_PORT}/mensajes?usuarioId=${usuario._id}&contactoId=${contactoId}`);

        if (!response.ok) throw new Error(`Error al obtener mensajes (${response.status})`);

        const mensajes = await response.json();
        console.log("✅ Mensajes obtenidos:", mensajes);
        chatMessages.innerHTML = "";

        mensajes.forEach((msg) => {
            const esMio = msg.usuarioId === usuario._id;
            const msgElement = document.createElement("div");
            msgElement.classList.add("mensaje", esMio ? "mio" : "otro");

            msgElement.innerHTML = `
                <p><strong>${esMio ? "Tú" : "Otro"}:</strong> ${msg.contenido}</p>
                <span class="fecha">${new Date(msg.fecha).toLocaleString()}</span>
            `;

            chatMessages.appendChild(msgElement);
        });

        chatMessages.scrollTop = chatMessages.scrollHeight;

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
    const mensajeInput =/** @type {HTMLInputElement | null} */( document.getElementById("mensaje-input"));
    const chatTitulo = document.getElementById("chat-titulo");

    if (!mensajeInput || !chatTitulo) return;

    const mensajeTexto = mensajeInput.value.trim();
    if (!mensajeTexto) {
        console.warn("⚠ No se puede enviar un mensaje vacío.");
        return;
    }

    try {
        const usuarioGuardado = localStorage.getItem("usuarioRegistrado");
        const usuario = JSON.parse(usuarioGuardado || "{}");
        const contactoId = chatTitulo.dataset.contactoId || null;

        console.log("📌 Enviando mensaje con:");
        console.log("Usuario ID:", usuario._id);
        console.log("Destino ID:", contactoId);
        console.log("Contenido:", mensajeTexto);

        const response = await fetch(`${location.protocol}//${location.hostname}${API_PORT}/mensajes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                usuarioId: usuario._id,
                receptorId: contactoId,
                contenido: mensajeTexto,
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error al enviar mensaje (${response.status}): ${errorText}`);
        }

        console.log("✅ Mensaje enviado correctamente.");
        mensajeInput.value = ""; 

        // 🚀 ACTUALIZAR EL CHAT INSTANTÁNEAMENTE DESPUÉS DE ENVIAR EL MENSAJE
      // ⚠️ Este es el cambio clave: asegurar que contactoId es válido antes de llamar abrirChat
      if (contactoId) {
        await abrirChat(contactoId);
    } else {
        console.error("❌ Error: contactoId es inválido al actualizar el chat.");
    }
} catch (error) {
    console.error("❌ Error al enviar mensaje:", error);
}
}


