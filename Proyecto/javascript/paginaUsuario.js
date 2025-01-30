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

        // Obtener elementos del DOM
        const nombreElement = document.getElementById("nombre");
        const chatList = document.getElementById("chat-list");
        const btnCreateChat = /** @type {HTMLButtonElement | null} */ (document.getElementById("btn-create-chat"));
        const btnCerrarSesion = /** @type {HTMLButtonElement | null} */ (document.getElementById("btn-cerrar-sesion"));
        const btnIrSecciones = /** @type {HTMLButtonElement | null} */ (document.getElementById("btn-ir-secciones"));
        const favoritosList = document.getElementById("favoritos-list");
        const chatPopup = document.getElementById("chat-popup");
        const chatTitulo = document.getElementById("chat-titulo");
        const chatMessages = document.getElementById("chat-messages");
        const mensajeInput = /** @type {HTMLInputElement | null} */ (document.getElementById("mensaje-input"));
        const enviarMensajeBtn = /** @type {HTMLButtonElement | null} */ (document.getElementById("enviar-mensaje"));
        const cerrarChatBtn = /** @type {HTMLButtonElement | null} */ (document.getElementById("cerrar-chat"));
    
    let usuarioActivo = "";
    let conversaciones = /** @type {Record<string, { remitente: string, mensaje: string }[]>} */ (
        JSON.parse(localStorage.getItem(`conversaciones_${usuario.id}`) || "{}")
    );
        const urlParams = new URLSearchParams(window.location.search);
        const servicioId = urlParams.get("servicioId");
        const servicioNombre = decodeURIComponent(urlParams.get("servicioNombre") || "");
        if (servicioId && servicioNombre) {
            usuarioActivo = servicioId;
            if (chatTitulo) chatTitulo.textContent = `Conversación sobre ${servicioNombre}`;
            if (chatPopup) chatPopup.classList.add("active");
            actualizarMensajes(servicioId);
        }
    // Mostrar el nombre del usuario
    if (nombreElement) nombreElement.textContent = usuario.nombre;
        
    function cargarChats() {
        if (!chatList) return;
        chatList.innerHTML = "";

        const chats = Object.keys(conversaciones);
        if (chats.length === 0) {
            chatList.innerHTML = "<p>No hay chats aún.</p>";
            return;
        }
        

        chats.forEach(chatId => {
            const chatItem = document.createElement("div");
            chatItem.classList.add("chat-item");
            chatItem.setAttribute("data-id", chatId);
            chatItem.innerHTML = `
                <strong>$ data-id  </strong>
                <button class="btn-eliminar-chat" data-id="${chatId}">🗑</button>
            `;
            chatList.appendChild(chatItem);
        });

        console.log("Chats cargados:", chats);
    }

    function cargarFavoritos() {
        if (!favoritosList) return;
        favoritosList.innerHTML = "";
        /** @type {{ id: string, nombre: string }[]} */
        const favoritos = JSON.parse(localStorage.getItem(`favoritos_${usuario.id}`) || "[]");

        if (favoritos.length === 0) {
            favoritosList.innerHTML = "<p>No tienes favoritos aún.</p>";
            return;
        }

        favoritos.forEach((/** @type {{ id: string; nombre: string | null; }} */ fav) => {
            const favItem = document.createElement("div");
            favItem.classList.add("favorito-item");
            favItem.setAttribute("data-id", fav.id);
            favItem.innerHTML = ` <span>${fav.nombre}</span>
            <button class="btn-eliminar-favorito" data-id="${fav.id}">❌</button>`;
            
            favoritosList.appendChild(favItem);
        });
        
        // 📌 Agregar evento a los botones de eliminar favoritos
        document.querySelectorAll(".btn-eliminar-favorito").forEach(btn => {
            btn.addEventListener("click", event => {
                const target = /** @type {HTMLElement} */ (event.target);
                const servicioId = target.getAttribute("data-id");
                if (servicioId) eliminarFavorito(servicioId);
            });
        });
        console.log("Favoritos cargados:", favoritos);
        }
        /**
     * @param {string} servicioId
     */
        function eliminarFavorito(servicioId) {
            /** @type {{ id: string, nombre: string }[]} */
            let favoritos = JSON.parse(localStorage.getItem(`favoritos_${usuario.id}`) || "[]");
    
            // Filtrar el servicio a eliminar
            favoritos = favoritos.filter(fav => fav.id !== servicioId);
    
            // Guardar la nueva lista en localStorage
            localStorage.setItem(`favoritos_${usuario.id}`, JSON.stringify(favoritos));
    
            // Volver a cargar los favoritos actualizados en la interfaz
            cargarFavoritos();
        }

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

    function guardarMensajes() {
        localStorage.setItem(`conversaciones_${usuario.id}`, JSON.stringify(conversaciones));
    }

    /**
     * @param {string} chatId
     */
    function abrirChat(chatId) {
        if (!chatPopup || !chatTitulo || !chatMessages) {
            console.error("No se encontraron los elementos del chat.");
            return;
        }
    
        // Intentamos encontrar el nombre real de la sección en favoritos
        const favoritos = JSON.parse(localStorage.getItem(`favoritos_${usuario.id}`) || "[]");
        const favoritoEncontrado = favoritos.find((/** @type {{ id: string; }} */ fav) => fav.id === chatId);
    
        // Si es una sección favorita, usamos su nombre; si no, usamos el `chatId` directamente
        const nombreMostrar = favoritoEncontrado ? favoritoEncontrado.nombre : chatId;
    
        usuarioActivo = chatId;
        chatTitulo.textContent = `Conversación con ${nombreMostrar}`; // ✅ Ahora muestra el nombre correcto
        chatPopup.classList.add("active"); // Muestra el chat
    
        console.log("Chat abierto:", chatId, "Nombre mostrado:", nombreMostrar);
    
        actualizarMensajes(chatId);
    }
    

    /**
     * @param {string} chatId
     */
    function actualizarMensajes(chatId) {
        if (!chatMessages) return;

        chatMessages.innerHTML = "";
        const mensajes = conversaciones[chatId] || [];

        console.log("Mensajes cargados para", chatId, mensajes);

        mensajes.forEach(msg => {
            const mensajeDiv = document.createElement("div");
            mensajeDiv.classList.add("mensaje");
            mensajeDiv.innerHTML = `<strong>${msg.remitente}:</strong> ${msg.mensaje}`;
            chatMessages.appendChild(mensajeDiv);
        });

        // Desplazar automáticamente al último mensaje
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    chatList?.addEventListener("click", (e) => {
        const target = /** @type {HTMLElement} */ (e.target);
        if (!target) return;

        // Si es botón de eliminar, eliminamos el chat
        if (target.classList.contains("btn-eliminar-chat")) {
            const chatId = target.getAttribute("data-id");
            if (chatId) eliminarChat(chatId);
            return;
        }

        // Si es un chat, lo abrimos
        const chatId = target.closest(".chat-item")?.getAttribute("data-id");
        if (chatId) abrirChat(chatId);
    });

    btnCerrarSesion?.addEventListener("click", () => {
        localStorage.removeItem("usuarioRegistrado");
        window.location.href = "registrar.html";
    });

    btnIrSecciones?.addEventListener("click", () => {
        window.location.href = "servicios.html";
    });
    favoritosList?.addEventListener("click", (e) => {
        const target = /** @type {HTMLElement} */ (e.target);
        if (!target) return;

        const seccionId = target.getAttribute("data-id");
        if (seccionId) abrirChat(seccionId);
    });

    cerrarChatBtn?.addEventListener("click", () => {
        chatPopup?.classList.remove("active");
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
        actualizarMensajes(usuarioActivo);
    });

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

    cargarChats();
    cargarFavoritos();
});
