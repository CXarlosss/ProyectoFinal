// @ts-check
document.addEventListener("DOMContentLoaded", () => {
    const usuarioGuardado = localStorage.getItem("usuarioRegistrado");
    const favoritosGuardados = localStorage.getItem("favoritos");

    const chatList = /** @type {HTMLElement | null} */ (document.getElementById("chat-list"));
    const chatPopup = /** @type {HTMLElement | null} */ (document.getElementById("chat-popup"));
    const chatMessages = /** @type {HTMLElement | null} */ (document.getElementById("chat-messages"));
    const chatTitulo = /** @type {HTMLElement | null} */ (document.getElementById("chat-titulo"));
    const cerrarChat = /** @type {HTMLButtonElement | null} */ (document.getElementById("cerrar-chat"));
    const mensajeInput = /** @type {HTMLInputElement | null} */ (document.getElementById("mensaje-input"));
    const enviarMensaje = /** @type {HTMLButtonElement | null} */ (document.getElementById("enviar-mensaje"));

    if (!chatList || !chatPopup || !chatMessages || !chatTitulo || !cerrarChat || !mensajeInput || !enviarMensaje) {
        console.error("Error: No se encontraron elementos en el DOM.");
        return;
    }

    let usuarioActivo = /** @type {string | null} */ (null);
    let conversaciones = /** @type {Record<string, { remitente: string, mensaje: string }[]>} */ (
        JSON.parse(localStorage.getItem("conversaciones") || "{}")
    );

    if (!usuarioGuardado) {
        alert("No hay usuario registrado.");
        window.location.href = "registrar.html"; // Redirigir si no hay usuario
        return;
    }

    const usuario = /** @type {{ nombre: string }} */ (JSON.parse(usuarioGuardado));
    const nombreUsuario = /** @type {HTMLElement | null} */ (document.getElementById("nombre"));

    if (nombreUsuario) {
        nombreUsuario.textContent = usuario.nombre;
    }

    // Cargar favoritos
    const favoritosList = /** @type {HTMLElement | null} */ (document.getElementById("favoritos-list"));
    if (favoritosList && favoritosGuardados) {
        const favoritos = /** @type {{ nombre: string }[]} */ (JSON.parse(favoritosGuardados));
        if (favoritos.length > 0) {
            favoritosList.innerHTML = favoritos
                .map(fav => `<div class="favorito-item">${fav.nombre}</div>`)
                .join("");
        } else {
            favoritosList.innerHTML = "<p>No tienes favoritos aún.</p>";
        }
    }

    // Cargar chats simulados
    const chats = /** @type {{ id: string, nombre: string }[]} */ ([
        { id: "1", nombre: "Juan Pérez" },
        { id: "2", nombre: "Ana García" }
    ]);

    if (chats.length > 0) {
        chatList.innerHTML = chats
            .map(chat => `<div class="chat-item" data-id="${chat.id}" data-nombre="${chat.nombre}"><strong>${chat.nombre}</strong></div>`)
            .join("");
    } else {
        chatList.innerHTML = "<p>No hay chats aún.</p>";
    }

    // Abrir chat
    chatList.addEventListener("click", (e) => {
        // Aseguramos que el target es un HTMLElement
        const target = /** @type {HTMLElement | null} */ (e.target);
        if (!target) return;
    
        // Convertimos a HTMLDivElement para poder acceder a dataset
        const chatItem = /** @type {HTMLDivElement | null} */ (target.closest(".chat-item"));
        if (!chatItem) return;
    
        const chatId = chatItem.dataset.id || "";
        const chatNombre = chatItem.dataset.nombre || "";
    
        if (!chatId || !chatNombre) {
            console.error("No se encontraron datos del chat en el dataset.");
            return;
        }
    
        usuarioActivo = chatId;
        chatTitulo.textContent = `Chat con ${chatNombre}`;
        chatPopup.classList.remove("hidden");
    
        cargarMensajes(usuarioActivo);
    });

    // Cerrar chat
    cerrarChat.addEventListener("click", () => {
        chatPopup.classList.add("hidden");
        usuarioActivo = null;
    });

    // Enviar mensaje
    enviarMensaje.addEventListener("click", () => {
        if (!usuarioActivo || !mensajeInput) return;

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
        cargarMensajes(usuarioActivo);
    });

    /**
     * Cargar mensajes en el chat activo.
     * @param {string} usuarioId
     */
    function cargarMensajes(usuarioId) {
        if (!chatMessages) return;

        chatMessages.innerHTML = "";

        if (!conversaciones[usuarioId] || conversaciones[usuarioId].length === 0) {
            chatMessages.innerHTML = "<p>No hay mensajes aún.</p>";
            return;
        }

        chatMessages.innerHTML = conversaciones[usuarioId]
            .map(msg => `<div class="mensaje"><strong>${msg.remitente}:</strong> ${msg.mensaje}</div>`)
            .join("");
    }

    /**
     * Guarda las conversaciones en `localStorage`.
     */
    function guardarMensajes() {
        localStorage.setItem("conversaciones", JSON.stringify(conversaciones));
    }
});
