//@ts-check

const API_PORT = location.port ? `:${location.port}` : '';
document.addEventListener("DOMContentLoaded", () => {
    
    //Captura elementos clave del DOM como botones y el área del chat.
    //Recupera el servicio guardado en localStorage y abre el chat si hay un servicio seleccionado.
    //Llama a cargarMensajes() y cargarMensajesRecibidosPorServicio() para obtener mensajes existentes.

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
    cargarMensajesRecibidosPorServicio(); // 🔥 Nueva función agregada
    
});

//CargarMensajes
//Obtiene el ID del usuario desde localStorage.
//Hace una solicitud al servidor para recuperar mensajes donde el usuario es emisor o receptor.
//Filtra mensajes relevantes y obtiene datos de usuarios y servicios.
//Asigna nombres reales a los mensajes.
//Llama a renderizarListaChats() para actualizar la UI.
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

        // 🔥 Obtener los mensajes filtrados solo para este usuario
        const response = await fetch(`${location.protocol}//${location.hostname}${API_PORT}/read/mensajes?usuarioId=${usuario._id}`);
        //const response = await fetch(`${location.protocol}//${location.hostname}${API_PORT}/api/read/mensajes?usuarioId=${usuario._id}`);

        if (!response.ok) throw new Error(`Error al obtener mensajes (${response.status})`);

        const mensajes = await response.json();
        console.log("✅ Mensajes obtenidos:", mensajes);

        // 🔥 Filtrar solo los mensajes en los que el usuario es emisor o receptor
        const mensajesFiltrados = mensajes.filter(m => 
            m.usuarioId === usuario._id || m.receptorId === usuario._id
        );

        console.log("✅ Mensajes después de filtrar:", mensajesFiltrados);

        // Si no hay mensajes después de filtrar, detenemos aquí
        if (mensajesFiltrados.length === 0) {
            console.warn("⚠ No hay mensajes para este usuario.");
            renderizarListaChats([], usuario._id, {});
            return;
        }
        // Obtener datos de usuarios y servicios
        const [usuariosResponse, serviciosResponse] = await Promise.all([
            fetch(`${location.protocol}//${location.hostname}${API_PORT}/read/users`),
            fetch(`${location.protocol}//${location.hostname}${API_PORT}/read/servicios`)
            //fetch(`${location.protocol}//${location.hostname}${API_PORT}/api/read/users`),
            //fetch(`${location.protocol}//${location.hostname}${API_PORT}/api/read/servicios`)
        ]);

        const usuarios = usuariosResponse.ok ? await usuariosResponse.json() : [];
        const servicios = serviciosResponse.ok ? await serviciosResponse.json() : [];

        console.log("✅ Usuarios obtenidos:", usuarios);
        console.log("✅ Servicios obtenidos:", servicios);

        // 🔥 Crear un mapa de nombres reales
        const mapaNombres = {};
        usuarios.forEach(user => mapaNombres[user._id] = user.nombre || user.email);
        servicios.forEach(servicio => mapaNombres[servicio._id] = servicio.nombre);

        console.log("📌 Mapa de nombres cargado:", mapaNombres); 

        // Asignar nombres reales a los mensajes
        mensajesFiltrados.forEach(msg => {
            msg.nombreEmisor = mapaNombres[msg.usuarioId] || "Usuario Desconocido";
            msg.nombreReceptor = mapaNombres[msg.receptorId] || "Usuario Desconocido";
        });

        console.log("✅ Mensajes después de asignar nombres:", mensajesFiltrados);

        renderizarListaChats(mensajesFiltrados, usuario._id, mapaNombres);

    } catch (error) {
        console.error("❌ Error al cargar mensajes:", error);
    }
}
//RenderizarListaChats
//Recibe los mensajes y los organiza en una lista de chats únicos.
//Muestra el último mensaje enviado en cada chat y la fecha del mensaje más reciente.
//Permite abrir un chat al hacer clic en un contacto.
/**
 * 📌 Renderiza la lista de chats en la UI con nombres reales.
 * @param {any[]} mensajes
 * @param {string} usuarioId
 */
function renderizarListaChats(mensajes, usuarioId, mapaNombres) {
    console.log("📌 Ejecutando renderizarListaChats()...");
    console.log("📌 Datos recibidos en renderizarListaChats:", mensajes);
    console.log("📌 Mapa de nombres recibido:", mapaNombres);

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

    mensajes.forEach((msg) => {
        const chatId = msg.chatId;
        const contactoId = msg.usuarioId === usuarioId ? msg.receptorId : msg.usuarioId;
        const contactoNombre = mapaNombres[contactoId] || `Usuario ${contactoId}`;

        console.log(`📌 Renderizando chat con: ${contactoNombre} (ID: ${contactoId})`);

        if (!chats[chatId]) {
            chats[chatId] = {
                id: contactoId,
                nombre: contactoNombre,
                ultimoMensaje: msg.contenido,
                fecha: new Date(msg.fecha).toLocaleString()
            };
        } else {
            chats[chatId].ultimoMensaje = msg.contenido;
            chats[chatId].fecha = new Date(msg.fecha).toLocaleString();
        }
    });

    Object.values(chats).forEach(chat => {
        const chatItem = document.createElement("div");
        chatItem.classList.add("chat-item");
        chatItem.innerHTML = `
            <p><strong>${chat.nombre || "Desconocido"}</strong></p> 
            <p>${chat.ultimoMensaje}</p>
            <span class="fecha">${chat.fecha}</span>
        `;

        chatItem.addEventListener("click", () => abrirChat(chat.id));

        chatList.appendChild(chatItem);
    });

    console.log("✅ Chats renderizados correctamente.");
}
//AbrirChats
//Recupera el chat guardado en localStorage.
//Busca si el contactoId es un servicio o un usuario y obtiene su nombre.
//Recupera los mensajes entre el usuario y el contacto del servidor.
//Renderiza los mensajes en la interfaz.
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

    if (!chatPopup || !chatMessages || !chatTitulo) {
        console.error("❌ Error: No se encontraron elementos en el DOM.");
        return;
    }

    if (!contactoId) {
        console.error("❌ Error: contactoId es undefined o null.");
        return;
    }

    // 🔥 Guardamos el chat abierto en localStorage
    localStorage.setItem("chatAbierto", contactoId);

    chatPopup.classList.add("active");
    chatTitulo.dataset.contactoId = contactoId;

    chatMessages.innerHTML = "";

    try {
        const usuarioGuardado = localStorage.getItem("usuarioRegistrado");
        const usuario = JSON.parse(usuarioGuardado || "{}");

        let nombreContacto = "Desconocido";
        let esServicio = false;

        // 🔍 Intentamos encontrar si el contacto es un servicio
        try {
            const servicioResponse = await fetch(`${location.protocol}//${location.hostname}${API_PORT}/read/servicios`);
            //const servicioResponse = await fetch(`${location.protocol}//${location.hostname}${API_PORT}/api/read/servicios`);
            if (servicioResponse.ok) {
                const servicios = await servicioResponse.json();
                const servicioEncontrado = servicios.find(s => s._id === contactoId);
                if (servicioEncontrado) {
                    nombreContacto = servicioEncontrado.nombre || "Servicio";
                    esServicio = true;
                }
            }
        } catch (error) {
            console.warn("⚠ No se pudo obtener el servicio", error);
        }

        // 🔍 Si no es un servicio, buscamos si es un usuario
        if (!esServicio) {
            try {
                const usuarioResponse = await fetch(`${location.protocol}//${location.hostname}${API_PORT}/read/users`);
                //const usuarioResponse = await fetch(`${location.protocol}//${location.hostname}${API_PORT}/api/read/users`);
                if (usuarioResponse.ok) {
                    const usuarios = await usuarioResponse.json();
                    const usuarioEncontrado = usuarios.find(user => user._id === contactoId);
                    if (usuarioEncontrado) {
                        nombreContacto = usuarioEncontrado.nombre || usuarioEncontrado.email || "Usuario";
                    }
                }
            } catch (error) {
                console.warn("⚠ No se pudo obtener el usuario", error);
            }
        }

        // 🔥 Mostrar el nombre en el chat
        chatTitulo.innerHTML = `Chat con ${nombreContacto}`;

        // 📨 Obtener los mensajes del chat
        const response = await fetch(`${location.protocol}//${location.hostname}${API_PORT}/mensajes?usuarioId=${usuario._id}&contactoId=${contactoId}`);
        //const response = await fetch(`${location.protocol}//${location.hostname}${API_PORT}/api/mensajes?usuarioId=${usuario._id}&contactoId=${contactoId}`);
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
//CargarMensajesRecibidosPorServicio
//Obtiene los servicios creados por el usuario.
//Filtra mensajes donde el receptor es un servicio del usuario y reasigna estos mensajes al dueño del servicio.
//Llama a renderizarListaChats() para mostrarlos en la interfaz.
/**
 * 📌 Carga los mensajes que han sido enviados a un servicio y los asigna también al creador del servicio.
 */
async function cargarMensajesRecibidosPorServicio() {
    try {
        console.log("📌 EJECUTANDO cargarMensajesRecibidosPorServicio()...");

        const usuarioGuardado = localStorage.getItem("usuarioRegistrado");
        if (!usuarioGuardado) throw new Error("❌ Usuario no registrado en localStorage");

        /** @type {{ _id: string, email: string }} */
        const usuario = JSON.parse(usuarioGuardado);
        if (!usuario._id) throw new Error("❌ ID de usuario no encontrado");

        console.log(`📌 Buscando servicios creados por el usuario: ${usuario._id}`);

        // 🔥 Obtener servicios creados por el usuario
        const serviciosResponse = await fetch(`${location.protocol}//${location.hostname}${API_PORT}/read/servicios?usuarioId=${usuario._id}`);
        //const serviciosResponse = await fetch(`${location.protocol}//${location.hostname}${API_PORT}/api/read/servicios?usuarioId=${usuario._id}`);
        if (!serviciosResponse.ok) throw new Error("Error al obtener servicios del usuario");

        const servicios = await serviciosResponse.json();
        console.log("✅ Servicios obtenidos en cargarMensajesRecibidosPorServicio:", servicios);

        const servicioDueño = new Map();
        servicios.forEach(servicio => {
            if (/^[a-fA-F0-9]{24}$/.test(servicio.usuarioId)) { 
                servicioDueño.set(String(servicio._id), String(servicio.usuarioId));
            } else {
                console.warn(`⚠ El servicio ${servicio._id} tiene un usuarioId inválido: ${servicio.usuarioId}`);
            }
        });

        // 🔥 Obtener mensajes
        const mensajesResponse = await fetch(`${location.protocol}//${location.hostname}${API_PORT}/read/mensajes`);
        //const mensajesResponse = await fetch(`${location.protocol}//${location.hostname}${API_PORT}/api/read/mensajes`);
        if (!mensajesResponse.ok) throw new Error("Error al obtener mensajes");

        const mensajes = await mensajesResponse.json();
        console.log("✅ Mensajes obtenidos en cargarMensajesRecibidosPorServicio:", mensajes);

        // 🔥 Filtrar mensajes que pertenecen a los servicios del usuario
        const mensajesParaUsuario = mensajes.filter(mensaje => servicioDueño.has(String(mensaje.receptorId)));

        console.log("📌 Mensajes filtrados:", mensajesParaUsuario);

        if (mensajesParaUsuario.length === 0) {
            console.log("⚠ No hay mensajes recibidos en servicios creados por el usuario.");
            return;
        }

        // 🔥 Asignar el dueño del servicio como receptor sin hacer un request innecesario
        const mensajesAsignados = mensajesParaUsuario.map(mensaje => {
            const dueñoId = servicioDueño.get(String(mensaje.receptorId));

            if (!dueñoId || !/^[a-fA-F0-9]{24}$/.test(dueñoId)) {
                console.error("❌ ERROR: dueñoId no es un ObjectId válido:", dueñoId);
                return null; // Evitar agregar mensajes incorrectos
            }

            console.log(`📌 Reasignando mensaje al dueño del servicio (ID: ${dueñoId})`);

            return {
                ...mensaje,
                receptorId: dueñoId, // Asignamos el dueño como receptor
            };
        }).filter(Boolean); // Filtramos mensajes inválidos

        console.log("📌 Mensajes listos para ser mostrados:", mensajesAsignados);

        // 🔥 Obtener datos de usuarios y servicios antes de crear el mapa de nombres
        const [usuariosResponse, serviciosResponse2] = await Promise.all([
            fetch(`${location.protocol}//${location.hostname}${API_PORT}/read/users`),
            fetch(`${location.protocol}//${location.hostname}${API_PORT}/read/servicios`)
            //fetch(`${location.protocol}//${location.hostname}${API_PORT}/api/read/users`),
            //fetch(`${location.protocol}//${location.hostname}${API_PORT}/api/read/servicios`)
        ]);

        const usuarios = usuariosResponse.ok ? await usuariosResponse.json() : [];
        const servicios2 = serviciosResponse2.ok ? await serviciosResponse2.json() : [];

        // 🔥 Crear un mapa de nombres reales
        const mapaNombres = {};
        usuarios.forEach(user => mapaNombres[user._id] = user.nombre || user.email);
        servicios2.forEach(servicio => mapaNombres[servicio._id] = servicio.nombre);

        console.log("📌 Mapa de nombres cargado en cargarMensajesRecibidosPorServicio():", mapaNombres);

        // 🔥 Mostrar en la UI en lugar de reenviar al backend
        renderizarListaChats(mensajesAsignados, usuario._id, mapaNombres);

    } catch (error) {
        console.error("❌ Error en cargarMensajesRecibidosPorServicio:", error);
    }
}
//CerrarChat
//Oculta el chat en la interfaz.
function cerrarChat() {
    const chatPopup = document.getElementById("chat-popup");
    console.log("📌 Cerrando el chat...");
    chatPopup?.classList.remove("active");

}
//EnviarMensaje
//Captura el texto ingresado por el usuario.
//Envía el mensaje al servidor mediante una solicitud POST.
//Si el mensaje se envía con éxito, se recarga el chat para mostrar el nuevo mensaje.
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

        if (!usuario._id || !contactoId) {
            console.error("❌ Error: Falta usuarioId o contactoId", { usuarioId: usuario._id, contactoId });
            return;
        }

        const mensajeData = {
            usuarioId: usuario._id,
            receptorId: contactoId,
            contenido: mensajeTexto,
        };

        console.log("📌 Datos enviados al servidor:", mensajeData);

        const response = await fetch(`${location.protocol}//${location.hostname}${API_PORT}/mensajes`, 
        // const response = await fetch(`${location.protocol}//${location.hostname}${API_PORT}/api/mensajes`, 
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(mensajeData),
        });

        const responseData = await response.json();
        console.log("📌 Respuesta del servidor:", responseData);

        if (!response.ok) {
            console.error(`❌ Error al enviar mensaje (${response.status}):`, responseData);
            return;
        }

        console.log("✅ Mensaje enviado correctamente.");
        mensajeInput.value = ""; 

        if (contactoId) {
            await abrirChat(contactoId);
        } else {
            console.error("❌ Error: contactoId es inválido al actualizar el chat.");
        }
    } catch (error) {
        console.error("❌ Error al enviar mensaje:", error);
    }
}





