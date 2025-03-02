// /server/server.js
//@ts-nocheck
/*eslint no-undef: "error"*/




const articlesJSON = `[{
      "id": 1,
      "nombre": "Clase de Yoga",
      "descripcion": "Clases de Yoga individualizadas para todos los niveles",
      "imagen": "https://images.pexels.com/photos/3823062/pexels-photo-3823062.jpeg",
      "ubicacion": "Avenida de la Paz, 123",
      "valoracion": 5,
      "categoria": "actividad",
      "precio": "0",
      "horarios": "Lunes a Viernes de 9:00 a 18:00",
      "metodoPago": "Efectivo, Tarjeta",
      "etiquetas": ["servicio", "especial"],
      "usuarioId": "1",
      "emailUsuario": "ClasedeYoga@example.com"
    },
    {
      "id": 2,
      "nombre": "Carnicería Los Tres",
      "descripcion": "Carnes frescas de calidad, producidas localmente.",
      "imagen": "https://images.pexels.com/photos/65174/pexels-photo-65174.jpeg",
      "ubicacion": "Calle de la Libertad, 45",
      "valoracion": 4,
      "categoria": "comercio",
      "precio": "0",
      "horarios": "Lunes a Viernes de 9:00 a 18:00",
      "metodoPago": "Efectivo, Tarjeta",
      "etiquetas": ["servicio", "especial"],
      "usuarioId": "1",
      "emailUsuario": "CarniceriaLosTres@example.com"
    },
    {
      "id": 3,
      "nombre": "Crosfit",
      "descripcion": "Clases de Crosfit de forma individual o grupal.",
      "imagen": "https://images.pexels.com/photos/1552249/pexels-photo-1552249.jpeg",
      "ubicacion": "Calle del Sol, 67",
      "valoracion": 4,
      "categoria": "actividad",
      "precio": "0",
      "horarios": "Lunes a Viernes de 9:00 a 18:00",
      "metodoPago": "Efectivo, Tarjeta",
      "etiquetas": ["servicio", "especial"],
      "usuarioId": "1",
      "emailUsuario": "Crosfit@gmail.com"
    },
    {
      "id": 4,
      "nombre": "Spa Relax",
      "descripcion": "Sesiones de spa y masajes terapéuticos.",
      "imagen": "https://images.pexels.com/photos/3865676/pexels-photo-3865676.jpeg",
      "ubicacion": "Calle Primavera, 10",
      "valoracion": 5,
      "categoria": "actividad",
      "precio": "50",
      "horarios": "Lunes a Domingo de 10:00 a 20:00",
      "metodoPago": "Efectivo, Tarjeta, PayPal",
      "etiquetas": ["relax", "masajes", "spa"],
      "usuarioId": "2",
      "emailUsuario": "SpaRelax@example.com"
    },
    {
      "id": 5,
      "nombre": "Gimnasio Fuerza Total",
      "descripcion": "Entrenamientos personalizados y clases grupales.",
      "imagen": "https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg",
      "ubicacion": "Avenida del Progreso, 5",
      "valoracion": 5,
      "categoria": "actividad",
      "precio": "35",
      "horarios": "Lunes a Sábado de 6:00 a 22:00",
      "metodoPago": "Efectivo, Tarjeta, Transferencia",
      "etiquetas": ["fitness", "gimnasio", "entrenamiento"],
      "usuarioId": "2",
      "emailUsuario": "GimnasioFuerzaTotal@example.com"
    },
    {
      "id": 6,
      "nombre": "Librería La Pluma",
      "descripcion": "Libros de todo tipo y accesorios para lectura.",
      "imagen": "https://images.pexels.com/photos/417060/pexels-photo-417060.jpeg",
      "ubicacion": "Calle Sabiduría, 12",
      "valoracion": 4,
      "categoria": "comercio",
      "precio": "0",
      "horarios": "Lunes a Viernes de 9:00 a 19:00",
      "metodoPago": "Efectivo, Tarjeta",
      "etiquetas": ["libros", "cultura", "lectura"],
      "usuarioId": "3",
      "emailUsuario": "LibreriaLaPluma@example.com"
    },
    {
      "id": 7,
      "nombre": "Cafetería El Aroma",
      "descripcion": "Café artesanal y pastelería casera.",
      "imagen": "https://images.pexels.com/photos/374885/pexels-photo-374885.jpeg",
      "ubicacion": "Calle del Café, 9",
      "valoracion": 5,
      "categoria": "comercio",
      "precio": "5",
      "horarios": "Lunes a Domingo de 7:00 a 21:00",
      "metodoPago": "Efectivo, Tarjeta",
      "etiquetas": ["café", "pastelería", "artesanal"],
      "usuarioId": "3",
      "emailUsuario": "CafeteriaElAroma@example.com"
    },
    {
      "id": 8,
      "nombre": "Escuela de Pintura Creativa",
      "descripcion": "Desarrolla tu talento artístico en un ambiente relajado.",
      "imagen": "https://images.pexels.com/photos/933255/pexels-photo-933255.jpeg",
      "ubicacion": "Plaza de las Artes, 21",
      "valoracion": 4,
      "categoria": "actividad",
      "precio": "20",
      "horarios": "Martes y Jueves de 16:00 a 19:00",
      "metodoPago": "Efectivo, Tarjeta, Transferencia",
      "etiquetas": ["arte", "pintura", "clases"],
      "usuarioId": "4",
      "emailUsuario": "PinturaCreativa@example.com"
    },
    {
      "id": 9,
      "nombre": "Tienda de Tecnología TechWorld",
      "descripcion": "Últimos gadgets y dispositivos electrónicos.",
      "imagen": "https://images.pexels.com/photos/3861968/pexels-photo-3861968.jpeg",
      "ubicacion": "Calle Tecnología, 3",
      "valoracion": 4,
      "categoria": "comercio",
      "precio": "0",
      "horarios": "Lunes a Viernes de 10:00 a 20:00",
      "metodoPago": "Efectivo, Tarjeta, PayPal",
      "etiquetas": ["tecnología", "gadgets", "electrónica"],
      "usuarioId": "4",
      "emailUsuario": "TechWorld@example.com"
    },
    {
      "id": 10,
      "nombre": "Taller de Fotografía Urbana",
      "descripcion": "Explora la ciudad y aprende técnicas de fotografía.",
      "imagen": "https://images.pexels.com/photos/3194513/pexels-photo-3194513.jpeg",
      "ubicacion": "Punto de encuentro: Plaza Central",
      "valoracion": 5,
      "categoria": "actividad",
      "precio": "25",
      "horarios": "Sábados de 10:00 a 13:00",
      "metodoPago": "Efectivo, Tarjeta",
      "etiquetas": ["fotografía", "urbano", "taller"],
      "usuarioId": "5",
      "emailUsuario": "FotografiaUrbana@example.com"
    },
    {
      "id": 11,
      "nombre": "Floristería Naturaleza Viva",
      "descripcion": "Arreglos florales y plantas de interior.",
      "imagen": "https://images.pexels.com/photos/4503736/pexels-photo-4503736.jpeg",
      "ubicacion": "Calle Primavera, 15",
      "valoracion": 5,
      "categoria": "comercio",
      "precio": "0",
      "horarios": "Lunes a Viernes de 9:00 a 18:00",
      "metodoPago": "Efectivo, Tarjeta",
      "etiquetas": ["flores", "naturaleza", "decoración"],
      "usuarioId": "5",
      "emailUsuario": "FloristeriaNaturalezaViva@example.com"
    },
    {
      "id": 12,
      "nombre": "Tienda de Ropa Vintage",
      "descripcion": "Encuentra piezas únicas de estilo retro.",
      "imagen": "https://images.pexels.com/photos/2062433/pexels-photo-2062433.jpeg",
      "ubicacion": "Calle del Tiempo, 7",
      "valoracion": 4,
      "categoria": "comercio",
      "precio": "0",
      "horarios": "Lunes a Sábado de 11:00 a 20:00",
      "metodoPago": "Efectivo, Tarjeta, Transferencia",
      "etiquetas": ["ropa", "vintage", "moda"],
      "usuarioId": "6",
      "emailUsuario": "TiendaVintage@example.com"
    },
    {
      "id": 13,
      "nombre": "Escuela de Cocina Gourmet",
      "descripcion": "Aprende a preparar recetas internacionales.",
      "imagen": "https://images.pexels.com/photos/4252138/pexels-photo-4252138.jpeg",
      "ubicacion": "Calle Sazón, 10",
      "valoracion": 5,
      "categoria": "actividad",
      "precio": "30",
      "horarios": "Viernes de 17:00 a 20:00",
      "metodoPago": "Efectivo, Tarjeta, PayPal",
      "etiquetas": ["cocina", "gastronomía", "clases"],
      "usuarioId": "6",
      "emailUsuario": "CocinaGourmet@example.com"
    },
    {
      "id": 14,
      "nombre": "Taller de Cerámica",
      "descripcion": "Diseña y crea tus propias piezas de cerámica.",
      "imagen": "https://images.pexels.com/photos/4041467/pexels-photo-4041467.jpeg",
      "ubicacion": "Avenida del Arte, 32",
      "valoracion": 5,
      "categoria": "actividad",
      "precio": "40",
      "horarios": "Miércoles y Sábados de 15:00 a 18:00",
      "metodoPago": "Efectivo, Tarjeta, Transferencia",
      "etiquetas": ["arte", "manualidades", "cerámica"],
      "usuarioId": "7",
      "emailUsuario": "TallerCeramica@example.com"
    },
    {
      "id": 15,
      "nombre": "Escuela de Danza Clásica",
      "descripcion": "Clases de ballet y danza contemporánea.",
      "imagen": "https://images.pexels.com/photos/1820145/pexels-photo-1820145.jpeg",
      "ubicacion": "Centro Cultural Moderno, 20",
      "valoracion": 5,
      "categoria": "actividad",
      "precio": "30",
      "horarios": "Lunes y Jueves de 16:00 a 19:00",
      "metodoPago": "Efectivo, Tarjeta",
      "etiquetas": ["danza", "ballet", "arte"],
      "usuarioId": "7",
      "emailUsuario": "DanzaClasica@example.com"
    },
    {
      "id": 16,
      "nombre": "Tienda de Bicicletas EcoRide",
      "descripcion": "Venta y reparación de bicicletas.",
      "imagen": "https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg",
      "ubicacion": "Avenida de la Naturaleza, 9",
      "valoracion": 4,
      "categoria": "comercio",
      "precio": "0",
      "horarios": "Lunes a Sábado de 10:00 a 19:00",
      "metodoPago": "Efectivo, Tarjeta",
      "etiquetas": ["bicicletas", "movilidad", "ecológico"],
      "usuarioId": "8",
      "emailUsuario": "EcoRide@example.com"
    },
    {
      "id": 17,
      "nombre": "Centro de Yoga Zen",
      "descripcion": "Clases de yoga y meditación guiada.",
      "imagen": "https://images.pexels.com/photos/317157/pexels-photo-317157.jpeg",
      "ubicacion": "Calle Tranquilidad, 5",
      "valoracion": 5,
      "categoria": "actividad",
      "precio": "20",
      "horarios": "Lunes a Viernes de 8:00 a 20:00",
      "metodoPago": "Efectivo, Tarjeta, PayPal",
      "etiquetas": ["yoga", "meditación", "relajación"],
      "usuarioId": "8",
      "emailUsuario": "YogaZen@example.com"
    },
    {
      "id": 18,
      "nombre": "Tienda de Juguetes Creativos",
      "descripcion": "Juguetes educativos y ecológicos para niños.",
      "imagen": "https://images.pexels.com/photos/620309/pexels-photo-620309.jpeg",
      "ubicacion": "Calle de la Imaginación, 12",
      "valoracion": 4,
      "categoria": "comercio",
      "precio": "0",
      "horarios": "Lunes a Domingo de 10:00 a 18:00",
      "metodoPago": "Efectivo, Tarjeta",
      "etiquetas": ["juguetes", "educación", "niños"],
      "usuarioId": "9",
      "emailUsuario": "JuguetesCreativos@example.com"
    },
    {
      "id": 19,
      "nombre": "Peluquería Belleza Total",
      "descripcion": "Cortes, tintes y tratamientos capilares.",
      "imagen": "https://images.pexels.com/photos/3993444/pexels-photo-3993444.jpeg",
      "ubicacion": "Avenida del Estilo, 15",
      "valoracion": 4,
      "categoria": "comercio",
      "precio": "25",
      "horarios": "Martes a Sábado de 9:00 a 18:00",
      "metodoPago": "Efectivo, Tarjeta",
      "etiquetas": ["belleza", "peluquería", "cuidado"],
      "usuarioId": "9",
      "emailUsuario": "BellezaTotal@example.com"
    },
    {
      "id": 20,
      "nombre": "Academia de Música SonArte",
      "descripcion": "Clases de guitarra, piano y canto.",
      "imagen": "https://images.pexels.com/photos/164743/pexels-photo-164743.jpeg",
      "ubicacion": "Calle Melodía, 10",
      "valoracion": 5,
      "categoria": "actividad",
      "precio": "35",
      "horarios": "Lunes a Viernes de 15:00 a 20:00",
      "metodoPago": "Efectivo, Tarjeta, Transferencia",
      "etiquetas": ["música", "guitarra", "piano"],
      "usuarioId": "10",
      "emailUsuario": "SonArte@example.com"
    }
  


  
    
]`

import * as http from "node:http";
import * as url from "node:url";

http.createServer(function server_onRequest (request, response) {
    let pathname = url.parse(request.url).pathname;

    console.log(`Request for ${pathname} received.`);
    // console.log(request.headers);

    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Content-Type', 'application/json');
    response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    response.setHeader("Access-Control-Allow-Headers", "*");
    response.setHeader('Access-Control-Max-Age', 2592000); // 30 days
    response.writeHead(200);

    // response.writeHead(200, {'Content-Type': 'application/json'});
    // response.write("<h1>Hello World</h1>");
    response.write(articlesJSON);
    response.end();
}).listen(process.env.PORT, process.env.IP);

console.log('Server running at http://' + process.env.IP + ':' + process.env.PORT + '/');