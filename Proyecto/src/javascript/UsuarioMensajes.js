//@ts-check
document.addEventListener("DOMContentLoaded", () => {
    console.log("📌 Cargando módulo de mensajes...");

    const chatList = document.getElementById("chat-list");
    const chatPopup = document.getElementById("chat-popup");
    const chatTitulo = document.getElementById("chat-titulo");
    const chatMessages = document.getElementById("chat-messages");
    const mensajeInput = document.getElementById("mensaje-input");
    const enviarMensajeBtn = document.getElementById("enviar-mensaje");
    const cerrarChatBtn = document.getElementById("cerrar-chat");

    let usuarioActivo = "";
    let conversaciones = {};

    function cargarChats() {
        if (!chatList) return;
        chatList.innerHTML = "";

        const chats = Object.keys(conversaciones);
        if (chats.length === 0) {
            chatList.innerHTML = "<p>No hay chats aún.</p>";
            return;
        }

        chats.forEach((chatId) => {
            const chatItem = document.createElement("div");
            chatItem.classList.add("chat-item");
            chatItem.setAttribute("data-id", chatId);
            chatItem.innerHTML = `
                <strong>Chat ${chatId}</strong>
                <button class="btn-eliminar-chat" data-id="${chatId}">🗑</button>
            `;
            chatList.appendChild(chatItem);
        });

        document.querySelectorAll(".btn-eliminar-chat").forEach((btn) => {
            btn.addEventListener("click", (event) => {
                event.stopPropagation();
                const chatId = btn.getAttribute("data-id");
                if (chatId) eliminarChat(chatId);
            });
        });
    }

    /**
     * @param {string} chatId
     */
    function abrirChat(chatId) {
        usuarioActivo = chatId;
        if (chatTitulo) chatTitulo.textContent = `Conversación con ${chatId}`;
        if (chatPopup) chatPopup.classList.add("active");
        actualizarMensajes(chatId);
    }

    /**
     * @param {string} chatId
     */
    function actualizarMensajes(chatId) {
        if (!chatMessages) return;

        chatMessages.innerHTML = "";
        const mensajes = conversaciones[chatId] || [];

        mensajes.forEach((/** @type {{ remitente: any; mensaje: any; }} */ msg) => {
            const mensajeDiv = document.createElement("div");
            mensajeDiv.classList.add("mensaje");
            mensajeDiv.innerHTML = `<strong>${msg.remitente}:</strong> ${msg.mensaje}`;
            chatMessages.appendChild(mensajeDiv);
        });

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function guardarMensajes() {
        localStorage.setItem("conversaciones", JSON.stringify(conversaciones));
    }

    /**
     * @param {string} chatId
     */
    function eliminarChat(chatId) {
        if (!chatId) return;

        if (confirm(`¿Seguro que quieres eliminar el chat con ${chatId}?`)) {
            delete conversaciones[chatId];
            guardarMensajes();
            cargarChats();
        }
    }

    if (enviarMensajeBtn) {
        enviarMensajeBtn.addEventListener("click", () => {
            if (!usuarioActivo || !mensajeInput || !chatMessages) return;

            const mensaje = mensajeInput.value.trim();
            if (mensaje === "") return;

            if (!conversaciones[usuarioActivo]) {
                conversaciones[usuarioActivo] = [];
            }

            conversaciones[usuarioActivo].push({
                remitente: "Yo",
                mensaje: mensaje,
            });

            mensajeInput.value = "";
            guardarMensajes();
            actualizarMensajes(usuarioActivo);
        });
    }

    if (cerrarChatBtn) {
        cerrarChatBtn.addEventListener("click", () => {
            chatPopup?.classList.remove("active");
            usuarioActivo = "";
        });
    }

    cargarChats();
});
