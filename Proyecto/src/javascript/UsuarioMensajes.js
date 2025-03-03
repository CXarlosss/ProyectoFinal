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
        localStorage.removeItem("servicioSeleccionado"); 
    }
    cargarMensajes();
    cargarMensajesRecibidosPorServicio(); 
});

//CargarMensajes
//Obtiene el ID del usuario desde localStorage.
//Hace una solicitud al servidor para recuperar mensajes donde el usuario es emisor o receptor.
//Filtra mensajes relevantes y obtiene datos de usuarios y servicios.
//Asigna nombres reales a los mensajes.
//Llama a renderizarListaChats() para actualizar la UI.
let mensajesUsuario = []; // Variable global temporal para fusionar mensajes

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
        if (!response.ok) throw new Error(`Error al obtener mensajes (${response.status})`);

        const mensajes = await response.json();
        console.log("📌 Mensajes obtenidos de la API (antes de filtrar):", mensajes);

        // 🔥 Filtrar solo los mensajes en los que el usuario es emisor o receptor
        mensajesUsuario = mensajes.filter(m => 
            String(m.usuarioId) === String(usuario._id) || String(m.receptorId) === String(usuario._id)
        );
        console.log("📌 Mensajes después de filtrar:", mensajesUsuario);

        // Obtener datos de usuarios y servicios
        const [usuariosResponse, serviciosResponse] = await Promise.all([
            fetch(`${location.protocol}//${location.hostname}${API_PORT}/read/users`),
            fetch(`${location.protocol}//${location.hostname}${API_PORT}/read/servicios`)
        ]);

        const usuarios = usuariosResponse.ok ? await usuariosResponse.json() : [];
        const servicios = serviciosResponse.ok ? await serviciosResponse.json() : [];

        console.log("✅ Usuarios obtenidos:", usuarios);
        console.log("✅ Servicios obtenidos:", servicios);

        // 🔥 Crear un mapa de nombres reales
        const mapaNombres = {};
        usuarios.forEach(user => mapaNombres[user._id] = user.nombre || user.email);
        servicios.forEach(servicio => {
            if (servicio.usuarioId === usuario._id) {
                mapaNombres[servicio._id] = servicio.nombre;
                console.log(`📌 Agregado servicio al mapa: ${servicio.nombre} (ID: ${servicio._id})`);
            }
        });

        console.log("📌 Mapa de nombres cargado:", mapaNombres);

        // Asignar nombres reales a los mensajes
        mensajesUsuario.forEach(msg => {
            msg.nombreEmisor = mapaNombres[msg.usuarioId] || "Usuario Desconocido";
            msg.nombreReceptor = mapaNombres[msg.receptorId] || "Usuario Desconocido";
        });

        console.log("✅ Mensajes después de asignar nombres:", mensajesUsuario);

        // 🔥 Llamar a `cargarMensajesRecibidosPorServicio()` para fusionar mensajes
        await cargarMensajesRecibidosPorServicio(usuario, mapaNombres);

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
        // 🔥 Ahora agrupamos por contactoId en lugar de chatId para evitar múltiples chats con la misma persona
        const contactoId = msg.usuarioId === usuarioId ? msg.receptorId : msg.usuarioId;
        const contactoNombre = mapaNombres[contactoId] || `Usuario ${contactoId}`;

        console.log(`📌 Renderizando chat con: ${contactoNombre} (ID: ${contactoId})`);

        // Si el chat con este contacto no existe, lo creamos
        if (!chats[contactoId]) {
            chats[contactoId] = {
                id: contactoId,
                nombre: contactoNombre,
                ultimoMensaje: msg.contenido,
                fecha: new Date(msg.fecha).toLocaleString()
            };
        } else {
            // Si ya existe, actualizamos solo el último mensaje y la fecha
            chats[contactoId].ultimoMensaje = msg.contenido;
            chats[contactoId].fecha = new Date(msg.fecha).toLocaleString();
        }
    });

    // 🔥 Renderizar cada chat en la UI
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
async function cargarMensajesRecibidosPorServicio(usuario, mapaNombres) {
    try {
        console.log("📌 EJECUTANDO cargarMensajesRecibidosPorServicio()...");

        console.log(`📌 Buscando servicios creados por el usuario: ${usuario._id}`);

        // 🔥 Obtener servicios creados por el usuario actual
        const serviciosResponse = await fetch(`${location.protocol}//${location.hostname}${API_PORT}/read/servicios?usuarioId=${usuario._id}`);
        if (!serviciosResponse.ok) throw new Error("Error al obtener servicios del usuario");

        const servicios = await serviciosResponse.json();
        console.log("✅ Servicios obtenidos en cargarMensajesRecibidosPorServicio:", servicios);

        // Crear un mapa de servicios cuyo dueño sea el usuario actual
        const servicioDueño = new Map();
        servicios.forEach(servicio => {
            if (String(servicio.usuarioId) === String(usuario._id)) {
                servicioDueño.set(String(servicio._id), String(servicio.usuarioId));
            }
        });

        console.log("📌 Mapa de servicios creados por el usuario:", servicioDueño);

        // 🔥 Obtener TODOS los mensajes
        const mensajesResponse = await fetch(`${location.protocol}//${location.hostname}${API_PORT}/read/mensajes`);
        if (!mensajesResponse.ok) throw new Error("Error al obtener mensajes");

        const mensajes = await mensajesResponse.json();
        console.log("✅ Mensajes obtenidos en cargarMensajesRecibidosPorServicio:", mensajes);

        // 🔥 Filtrar mensajes donde el receptor sea un servicio creado por el usuario actual
        const mensajesServicios = mensajes.filter(mensaje =>
            servicioDueño.has(String(mensaje.receptorId)) &&
            String(servicioDueño.get(String(mensaje.receptorId))) === String(usuario._id) // Verifica que el dueño sea el usuario actual
        );

        console.log("📌 Mensajes después de filtrar (solo servicios del usuario):", mensajesServicios);

        // 🔥 Asignar el dueño del servicio como receptor sin hacer un request innecesario
        const mensajesAsignados = mensajesServicios.map(mensaje => {
            const dueñoId = servicioDueño.get(String(mensaje.receptorId));

            if (!dueñoId || !/^[a-fA-F0-9]{24}$/.test(dueñoId)) {
                console.error(`❌ ERROR: dueñoId no es un ObjectId válido: ${dueñoId}`);
                return null; // Evita agregar mensajes incorrectos
            }

            console.log(`📌 Reasignando mensaje al dueño del servicio (ID: ${dueñoId})`);

            return {
                ...mensaje,
                receptorId: dueñoId, // Asignamos el dueño como receptor
            };
        }).filter(Boolean); // Filtramos mensajes inválidos

        console.log("📌 Mensajes de servicios listos para ser mostrados:", mensajesAsignados);

        // 🔥 Fusionamos los mensajes de usuario y los de servicios
        const mensajesFinales = [...mensajesUsuario, ...mensajesAsignados];

        console.log("📌 Mensajes totales a renderizar:", mensajesFinales);

        // 🔥 Mostrar en la UI
        renderizarListaChats(mensajesFinales, usuario._id, mapaNombres);

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





