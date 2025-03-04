#  Proyecto LocalMarket

LocalMarket es una plataforma desarrollada con Node.js, Express y MongoDB que permite la gestión de servicios y usuarios, así como la comunicación mediante un sistema de mensajería.

#  Tecnologías Utilizadas

Backend: `Node.js`,` Express.js`,`MongoDB`

Base de Datos:` MongoDB (conectado mediante mongodb)`

Autenticación: (Pendiente de implementación)

Frontend: (Si hay un cliente separado, se puede documentar aquí)

Herramientas adicionales: ESLint, dotenv, body-parser, CORS

#  Estructura del Proyecto
```plaintext
📁 Proyecto/
│── 📂 server/              # Servidor y lógica del backend
│   │── server-express.js    # Servidor principal Express
│   │── server-api.js        # API REST
│   │── server-statics.js    # Servidor de archivos estáticos
│   │── server-mongodb.js    # Conexión y operaciones en MongoDB
│── 📂 public/              # Archivos estáticos (HTML, CSS, JS)
│── 📂 src/                 # Código fuente del frontend
│── 📄 .env                 # Variables de entorno
│── 📄 package.json         # Configuración del proyecto y dependencias
│── 📄 README.md            # Documentación
```
#  Instalación y Configuración

##  Clonar el Repositorio

Clona el repositorio desde GitHub:

```bash
git clone https://github.com/CXarlosss/ProyectoFinal.git
cd Proyecto
```
##  Instalar Dependencias
`npm install`
##  Configurar el Archivo .env
Crea un archivo .env en la raíz del proyecto y agrega lo siguiente:
`MONGO_URI=mongodb://127.0.0.1:27017/LocalMarket`
`PORT=3001`
##  Iniciar el Servidor
`npm start`
O manualmente:
`node server/server-express.js`

#  Scripts Disponibles

Desde el archivo `package.json`, puedes ejecutar los siguientes comandos:

| Comando                         | Descripción                                      |
|---------------------------------|--------------------------------------------------|
| `npm start`                     | Inicia el servidor principal con Express        |
| `npm run server:express:start`  | Inicia el servidor con variables de entorno     |
| `npm run server:statics:start`  | Inicia el servidor de archivos estáticos        |
| `npm run server:api:start`      | Inicia solo el servidor de la API               |
| `npm run lint`                  | Ejecuta ESLint para validar código              |


#  Modelo de datos y relaciones entre componentes
![GESTION DE DATOS DE LOCALMARKET](https://github.com/user-attachments/assets/c1cac5f6-9a70-41ed-a7be-61b395952849)


##  Usuarios

| Método  | Ruta                  | Descripción             |
|---------|------------------------|-------------------------|
| POST    | `/create/users`        | Crea un nuevo usuario   |
| GET     | `/read/users`          | Obtiene todos los usuarios |
| PUT     | `/update/users/:id`    | Actualiza un usuario    |
| DELETE  | `/delete/users/:id`    | Elimina un usuario      |

##  Servicios

| Método  | Ruta                     | Descripción                |
|---------|---------------------------|----------------------------|
| POST    | `/create/servicios`       | Crea un nuevo servicio     |
| GET     | `/read/servicios`         | Obtiene todos los servicios |
| GET     | `/read/servicio/:id`      | Obtiene un servicio por ID |
| PUT     | `/update/servicios/:id`   | Actualiza un servicio      |
| DELETE  | `/delete/servicios/:id`   | Elimina un servicio        |


#  Despliegue en Producción

##  Opciones de Despliegue

###  Netlify (Si hay frontend)

- Inicia sesión en Netlify

- Crea una nueva aplicación

- Configura MongoDB como servicio

- Despliega la aplicación

###  Render (Para backend y frontend)

- Crea una cuenta en Render

- Conéctalo a tu repositorio de GitHub

- Configura las variables de entorno (MONGO_URI, PORT=3001)

- Ejecuta npm start para iniciar la aplicación

###  Contribuciones

# ¡Las contribuciones son bienvenidas!Si deseas contribuir, sigue estos pasos:

- Haz un fork del repositorio.

- Crea una nueva rama para tu funcionalidad:

-- `git checkout -b feature-nueva`

- Realiza tus cambios y haz commit:

-- `git commit -m "Agrego nueva funcionalidad"`

- Envía un pull request para revisión.

### Licencia

 Este proyecto está bajo la licencia MIT.Consulta el archivo LICENSE para más detalles.

