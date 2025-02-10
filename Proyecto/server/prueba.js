

import { Usuario, Servicio, Mensaje } from "../src/clases/class.js";

// Crear usuario
const usuario1 = new Usuario("1", "Carlos", "carlos@mail.com", "pass123", "123456789", "Madrid");

// Crear servicio
const servicio1 = new Servicio("101", "Clases de Piano", "Aprende a tocar el piano", 20, 4.5, "Madrid", "10:00 - 18:00", "Tarjeta", "Educación", "img.jpg", ["música", "clases"], "1", "carlos@mail.com", "¡Hola! Estoy interesado en tus clases.");

// Agregar un servicio a favoritos
usuario1.agregarFavorito(servicio1._id);
console.log(usuario1.favoritos); // ["101"]

// Intentar agregar el mismo servicio de nuevo
usuario1.agregarFavorito(servicio1._id); // "El servicio ya está en favoritos."

// Eliminar un favorito
usuario1.eliminarFavorito(servicio1._id);
console.log(usuario1.favoritos); // []

// Enviar un mensaje a un servicio
const mensaje1 = new Mensaje("500", usuario1._id, servicio1._id, "Me interesa tu servicio. ¿Podemos hablar?");
console.log(mensaje1.obtenerFechaFormateada()); // Muestra la fecha del mensaje
