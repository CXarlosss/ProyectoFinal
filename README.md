[![Netlify Status](https://api.netlify.com/api/v1/badges/7eda913a-98f6-478d-a097-55a2bb2ef6d7/deploy-status)](https://app.netlify.com/sites/flourishing-baklava-adefd3/deploys)
#  Proyecto LocalMarket

LocalMarket es una plataforma desarrollada con Node.js, Express y MongoDB que permite la gestión de servicios y usuarios, así como la comunicación mediante un sistema de mensajería.
Puedes visitar la pagina desplegada en Netlify: [LOCALMARKET](https://flourishing-baklava-adefd3.netlify.app/)
Aqui podeis apreciar dos de las paginas principales:
### Pagina del Usuario:
Donde podra hacer favoritos a los servicios y tambien realizar chats con ellos
![Captura de pantalla (36)](https://github.com/user-attachments/assets/5c380750-9124-4013-9a6f-e38ebd54d289)

### Pagina de los servicios
Donde podra buscar servicios nuevos para poder hablarles o añadirlos a favoritos
![Captura de pantalla (34)](https://github.com/user-attachments/assets/18c2f812-3ae0-47b8-9037-3b29f9263a99)

#  Tecnologías Utilizadas

##  Frontend
- **HTML**
- **CSS** (Responsive)
- **JavaScript**: Programación funcional, principios SOLID, patrones de diseño
- **JavaScript Nativo** y **Lit Element** como librería de componentes web
- **TypeScript** para el tipado del código

##  Backend
- **Node.js** `>= 20.0.0`
- **Express.js** para el servidor
- **MongoDB** como base de datos (conectado mediante `mongodb`)
- **APIs REST** con Express.js

## Progressive Web App (PWA)
- Habilitación como PWA para instalación en dispositivos móviles

##  Documentación y Buenas Prácticas
- **JSDoc** para la documentación del código
- **GitHub** para gestión de repositorios
- **Git Hooks** y **Linters** para comprobación de errores:
  - `ESLint`
  - `StyleLint`
  - `Lint-Staged`
  - `commitlint`
- **Conventional Commits** para mensajes de commits estandarizados

##  Testing y Herramientas de Desarrollo
- **Jest** como herramienta de testeo (Ejemplos en `/js/test`)
- **Postman** para pruebas de API
- **Netlify** para despliegue:
  - Archivo `api.mjs` en `netlify/functions`
  - Configuración en `netlify.toml`

##  Plugins y Extensiones Recomendadas (VS Code)
- **GitHub Pull Requests**
- **Live Preview**
- **Live Server**
- **Error Lens**
- **Markdownlint**
- **lit-html**
- **CORS**

#  Estructura del Proyecto
```plaintext
📁 netlify/functions
│── api.mjs
📁 Proyecto/
│── 📂 server/              # Servidor y lógica del backend
│   │── server-express.js    # Servidor principal Express
│   │── server-api.js        # API REST
│   │── server-statics.js    # Servidor de archivos estáticos
│   │── server-mongodb.js    # Conexión y operaciones en MongoDB
│── 📂 public/              # Archivos estáticos (HTML, CSS, JS)
│── 📂 src/                 # Código fuente del frontend
│ 📄 .env                 # Variables de entorno
│ 📄 package.json         # Configuración del proyecto y dependencias
│ 📄 README.md            # Documentación
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
![GESTION DE DATOS DE LOCALMARKET](https://github.com/user-attachments/assets/a3e58e3c-7ba9-4c2d-adc4-792ff0b2ecb8)



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

