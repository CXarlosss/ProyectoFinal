// @ts-check

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM cargado correctamente.");

    // Verificar si hay un usuario registrado
    const usuarioGuardado = localStorage.getItem("usuarioRegistrado");

    if (!usuarioGuardado) {
        alert("No hay usuario registrado.");
        window.location.href = "registrar.html";
        return;
    }

    /** @type {{ id: string, nombre: string }} */
    const usuario = JSON.parse(usuarioGuardado);

    // Elementos principales
    const nombreElement = /** @type {HTMLElement | null} */ (document.getElementById("nombre"));
    const chatList = /** @type {HTMLElement | null} */ (document.getElementById("chat-list"));
    const btnCreateChat = /** @type {HTMLButtonElement | null} */ (document.getElementById("btn-create-chat"));
    const btnCerrarSesion = /** @type {HTMLButtonElement | null} */ (document.getElementById("btn-cerrar-sesion"));
    const btnIrSecciones = /** @type {HTMLButtonElement | null} */ (document.getElementById("btn-ir-secciones"));
    const favoritosList = /** @type {HTMLElement | null} */ (document.getElementById("favoritos-list"));
    const chatPopup = /** @type {HTMLElement | null} */ (document.getElementById("chat-popup"));
    const chatTitulo = /** @type {HTMLElement | null} */ (document.getElementById("chat-titulo"));
    const chatMessages = /** @type {HTMLElement | null} */ (document.getElementById("chat-messages"));
    const mensajeInput = /** @type {HTMLInputElement | null} */ (document.getElementById("mensaje-input"));
    const enviarMensajeBtn = /** @type {HTMLButtonElement | null} */ (document.getElementById("enviar-mensaje"));
    const cerrarChatBtn = /** @type {HTMLButtonElement | null} */ (document.getElementById("cerrar-chat"));

    let usuarioActivo = "";
    let conversaciones = /** @type {Record<string, { remitente: string, mensaje: string }[]>} */ (
        JSON.parse(localStorage.getItem(`conversaciones_${usuario.id}`) || "{}")
    );

    // Asignar nombre del usuario en la bienvenida
    if (nombreElement) {
        nombreElement.textContent = usuario.nombre;
    }

    function cargarChats() {
        if (!chatList) return;

        const chats = Object.keys(conversaciones).map(id => ({
            id,
            nombre: id
        }));

        chatList.innerHTML = chats.length > 0
            ? chats.map(chat => `
                <div class="chat-item" data-id="${chat.id}">
                    <strong>${chat.nombre}</strong>
                    <button class="btn-eliminar-chat" data-id="${chat.id}">🗑</button>
                </div>
            `).join("")
            : "<p>No hay chats aún.</p>";
    }

    cargarChats();

    function cargarFavoritos() {
        if (!favoritosList) return;

        const favoritos = /** @type {{ id: string, nombre: string }[]} */ (
            JSON.parse(localStorage.getItem(`favoritos_${usuario.id}`) || "[]")
        );

        favoritosList.innerHTML = favoritos.length > 0
            ? favoritos.map(fav => `<div class="favorito-item">${fav.nombre}</div>`).join("")
            : "<p>No tienes favoritos aún.</p>";
    }

    cargarFavoritos();

    btnCreateChat?.addEventListener("click", () => {
        const nombreChat = prompt("Introduce el nombre del usuario con quien quieres chatear:");
        if (!nombreChat) return;

        const chatId = nombreChat.toLowerCase().replace(/\s+/g, "-");

        if (!conversaciones[chatId]) {
            conversaciones[chatId] = [];
            guardarMensajes();
            cargarChats();
            alert(`Chat con ${nombreChat} creado exitosamente.`);
        } else {
            alert("Ya tienes un chat con este usuario.");
        }
    });

    btnCerrarSesion?.addEventListener("click", () => {
        localStorage.removeItem("usuarioRegistrado");
        window.location.href = "registrar.html";
    });

    btnIrSecciones?.addEventListener("click", () => {
        window.location.href = "servicios.html";
    });

    chatList?.addEventListener("click", (e) => {
        const target = /** @type {HTMLElement | null} */ (e.target);
        if (!target) return;

        if (target.classList.contains("btn-eliminar-chat")) {
            const chatId = target.dataset.id || "";
            if (chatId) eliminarChat(chatId);
            return;
        }

        if (target.classList.contains("chat-item")) {
            const chatId = target.dataset.id || "";
            if (chatId) abrirChat(chatId);
        }
    });

    /**
     * @param {string} chatId
     */
    function abrirChat(chatId) {
        if (!chatId) return;

        try {
            usuarioActivo = chatId;
            if (chatTitulo) {
                chatTitulo.textContent = `Chat con ${chatId}`;
            } else {
                throw new Error("No se encontró el título del chat.");
            }

            if (chatPopup) {
                chatPopup.classList.remove("hidden");
            } else {
                throw new Error("No se encontró el contenedor del chat.");
            }

            if (chatMessages) {
                chatMessages.innerHTML = cargarMensajes(chatId);
            } else {
                throw new Error("No se encontró el contenedor de mensajes del chat.");
            }
        } catch (error) {
            alert(`Error al abrir el chat con ${chatId}: ${error}`);
        }
    }

    cerrarChatBtn?.addEventListener("click", () => {
        chatPopup?.classList.add("hidden");
        usuarioActivo = "";
    });

    enviarMensajeBtn?.addEventListener("click", () => {
    if (!usuarioActivo || !mensajeInput || !chatMessages) return;

    const mensaje = mensajeInput.value.trim();
    if (mensaje === "") return;

    if (!conversaciones[usuarioActivo]) {
        conversaciones[usuarioActivo] = [];
    }

    conversaciones[usuarioActivo].push({
        remitente: usuario.nombre,
        mensaje: mensaje
    });

    mensajeInput.value = "";
    guardarMensajes();

    if (chatMessages) {
        chatMessages.innerHTML = cargarMensajes(usuarioActivo);
    }
});


    /**
     * @param {string} chatId
     */
    function cargarMensajes(chatId) {
        return conversaciones[chatId]?.map(msg => `<div class="mensaje"><strong>${msg.remitente}:</strong> ${msg.mensaje}</div>`).join("") || "<p>No hay mensajes aún.</p>";
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

    function guardarMensajes() {
        localStorage.setItem(`conversaciones_${usuario.id}`, JSON.stringify(conversaciones));
    }
});
