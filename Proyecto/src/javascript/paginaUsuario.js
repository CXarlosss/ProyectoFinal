// @ts-check
/* import { store } from "../store/redux.js";
 */
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
        const btnBorrar = document.getElementById("btn-borrar");
     


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
    
    
    
    /**
     * @param {string} chatId
     * @param {string} nombreChat
     */
    function abrirChat(chatId, nombreChat = "") {
        usuarioActivo = chatId;
    
        let nombresServicios = JSON.parse(localStorage.getItem("nombresServicios") || "{}");
    
        console.log("📌 [abrirChat] Intentando abrir chat con ID:", chatId);
        console.log("📌 [abrirChat] Estado actual de nombresServicios en localStorage:", nombresServicios);
    
        // Verificar si el nombre está en favoritos antes de asignar otro por defecto
        let favoritos = JSON.parse(localStorage.getItem(`favoritos_${usuario.id}`) || "[]");
        let favorito = favoritos.find((/** @type {{ id: string; }} */ fav) => fav.id === chatId);
    
        let nombreReal = nombresServicios[chatId] || nombreChat || (favorito ? favorito.nombre : `Conversación sin nombre (${chatId})`);
    
        // Si el nombre no existe en nombresServicios pero sí en favoritos, lo guardamos correctamente
        if (!nombresServicios[chatId] && favorito) {
            nombresServicios[chatId] = favorito.nombre;
            localStorage.setItem("nombresServicios", JSON.stringify(nombresServicios));
            console.log("✅ [abrirChat] Nombre corregido desde favoritos:", favorito.nombre);
        }
    
        if (chatTitulo) chatTitulo.textContent = `Conversación con ${nombreReal}`;
        if (chatPopup) chatPopup.classList.add("active");
    
        console.log("📌 [abrirChat] Nombre mostrado en la interfaz:", nombreReal);
    
        actualizarMensajes(chatId);
    }
    
    
    
    
    
    /**
     * @param {string} chatId
     * @param {string} nombreChat
     */
    

    function guardarNombreChat(chatId, nombreChat) {
        if (!chatId || !nombreChat.trim()) return;
    
        let nombresServicios = JSON.parse(localStorage.getItem("nombresServicios") || "{}");
    
        nombresServicios[chatId] = nombreChat.trim(); 
    
        localStorage.setItem("nombresServicios", JSON.stringify(nombresServicios));
    
        console.log("✅ [guardarNombreChat] Guardado correctamente:", chatId, nombreChat);
        console.log("📌 Estado actual de nombresServicios en localStorage:", nombresServicios);
    }
    
    btnCreateChat?.addEventListener("click", () => {
        const nombreChat = prompt("Introduce el nombre del usuario con quien quieres chatear:");
        if (!nombreChat) return;
    
        const chatId = `chat-${Date.now()}`; // 📌 Generar un ID único
    
        if (!conversaciones[chatId]) {
            conversaciones[chatId] = [];
            
            // 📌 Guardar el nombre correctamente
            guardarNombreChat(chatId, nombreChat);
    
            guardarMensajes();
            cargarChats();
            alert(`Chat con ${nombreChat} creado exitosamente.`);
        } else {
            alert("Ya tienes un chat con este usuario.");
        }
    });
    
    
    
    
    function cargarChats() {
        if (!chatList) return;
        chatList.innerHTML = "";
    
        const chats = Object.keys(conversaciones);
        if (chats.length === 0) {
            chatList.innerHTML = "<p>No hay chats aún.</p>";
            return;
        }
    
        let nombresServicios = JSON.parse(localStorage.getItem("nombresServicios") || "{}");
        let favoritos = JSON.parse(localStorage.getItem(`favoritos_${usuario.id}`) || "[]");
    
        console.log("📌 [cargarChats] Estado actual de nombresServicios en localStorage:", nombresServicios);
        console.log("📌 [cargarChats] Chats detectados en conversaciones:", chats);
    
        chats.forEach(chatId => {
            let nombreChat = nombresServicios[chatId];
    
            // Si el chat está en favoritos, aseguramos que mantiene ese nombre
            let favorito = favoritos.find((/** @type {{ id: string; }} */ fav) => fav.id === chatId);
            if (favorito && favorito.nombre) {
                console.log(`✅ [cargarChats] Corrigiendo nombre de ${chatId} a ${favorito.nombre} desde favoritos.`);
                nombreChat = favorito.nombre;
                nombresServicios[chatId] = favorito.nombre;
                localStorage.setItem("nombresServicios", JSON.stringify(nombresServicios));
            }
    
            if (!nombreChat || nombreChat.startsWith("Conversación sin nombre")) {
                console.warn(`🚨 [cargarChats] Nombre no encontrado para chatId: ${chatId}, asignando nombre automático.`);
                nombreChat = `Chat ${Object.keys(nombresServicios).length + 1}`;
                nombresServicios[chatId] = nombreChat;
                localStorage.setItem("nombresServicios", JSON.stringify(nombresServicios));
            }
    
            console.log(`✅ [cargarChats] Chat ${chatId} asignado con nombre: ${nombreChat}`);
    
            const chatItem = document.createElement("div");
            chatItem.classList.add("chat-item");
            chatItem.setAttribute("data-id", chatId);
            chatItem.innerHTML = `
                <strong>${nombreChat}</strong>
                <button class="btn-eliminar-chat" data-id="${chatId}">🗑</button>
            `;
            chatList.appendChild(chatItem);
        });
    }
    
    
    cargarFavoritos();    
    
    cargarChats();

    function cargarFavoritos() {
        if (!favoritosList) return;
        favoritosList.innerHTML = "";
    
        /** @type {{ id: string, nombre: string }[]} */
        const favoritos = JSON.parse(localStorage.getItem(`favoritos_${usuario.id}`) || "[]").slice(0,5);
    
        if (favoritos.length === 0) {
            favoritosList.innerHTML = "<p>No tienes favoritos aún.</p>";
            return;
        }
    
        favoritos.forEach((/** @type {{ id: string; nombre: string }} */ fav) => {
            /** @type {HTMLDivElement} */
            const favItem = document.createElement("div");
            favItem.classList.add("favorito-item");
            favItem.setAttribute("data-id", fav.id);
            favItem.innerHTML = `
                <span>${fav.nombre}</span>
                <button class="btn-eliminar-favorito" data-id="${fav.id}">❌</button>
            `;
    
            favoritosList.appendChild(favItem);
        });
    
        // 📌 Agregar evento a los botones de eliminar favoritos y evitar que se abra el chat
        document.querySelectorAll(".btn-eliminar-favorito").forEach(btn => {
            btn.addEventListener("click", event => {
                event.stopPropagation(); // Evita que el evento se propague al contenedor padre
                const target = /** @type {HTMLElement} */ (event.target);
                const servicioId = target.getAttribute("data-id");
                if (servicioId) eliminarFavorito(servicioId);
            });
        });
    
        console.log("Favoritos cargados:", favoritos);
    }
    /**
 * 📌 Elimina un servicio de la lista de favoritos y actualiza la interfaz.
 * @param {string} servicioId - ID del servicio a eliminar.
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

    // 📌 Evento para abrir chat desde favoritos, pero ignorando el botón "❌"
    favoritosList?.addEventListener("click", (e) => {
        const target = /** @type {HTMLElement} */ (e.target);
        if (!target) return;

        // 📌 Evitar abrir el chat si el clic viene de "❌"
        if (target.classList.contains("btn-eliminar-favorito")) return;
        const nombreChat = target.textContent?.trim() || "Chat sin nombre"; // 📌 Extraer el nombre correcto


        const seccionId = target.getAttribute("data-id");
        if (seccionId) abrirChat(seccionId, nombreChat);
    });

    function guardarMensajes() {
        localStorage.setItem(`conversaciones_${usuario.id}`, JSON.stringify(conversaciones));
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
    
    if (enviarMensajeBtn) {
        enviarMensajeBtn.addEventListener("click", () => {
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
            localStorage.setItem(`conversaciones_${usuario.id}`, JSON.stringify(conversaciones));
            actualizarMensajes(usuarioActivo);
        });
    }
    if (cerrarChatBtn) {
        cerrarChatBtn.addEventListener("click", () => {
            chatPopup?.classList.remove("active");
            usuarioActivo = "";
        });
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
        const nombreChat = target.closest(".chat-item")?.textContent?.trim() || "Chat sin nombre";

        if (chatId) abrirChat(chatId, nombreChat);
    });

    btnCerrarSesion?.addEventListener("click", () => {
        localStorage.removeItem("usuarioRegistrado");
        window.location.href = "registrar.html";
    });

    btnIrSecciones?.addEventListener("click", () => {
        window.location.href = "servicios.html";
    });
    

 
    if (btnBorrar) {
        btnBorrar.addEventListener("click", () => {
            if (confirm("¿Estás seguro de que quieres borrar todas las secciones almacenadas? Esta acción no se puede deshacer.")) {
                // 🔴 Elimina solo las claves relacionadas con las secciones
                localStorage.removeItem("servicios");
                localStorage.removeItem("favoritos");
                localStorage.removeItem("mensajes");

                console.log("Todas las secciones han sido eliminadas del almacenamiento.");
                alert("Todas las secciones han sido eliminadas.");
                
                // Recargar la página para actualizar la interfaz
                location.reload();
            }
        });
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

    cargarChats();
    cargarFavoritos();
});

