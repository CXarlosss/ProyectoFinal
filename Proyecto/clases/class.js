export class Usuario {
    /**
     * @param {number} id
     * @param {string} nombre
     * @param {string} email
     * @param {string} password
     * @param {string} telefono
     * @param {string} direccion
     * @param {string} tipo
     * @param {Array<Object>} historial
     * @param {Array<number>} servicios - Lista de IDs de los servicios que ofrece el usuario
     */
    constructor(id, nombre, email, password, telefono, direccion, tipo = "cliente", historial = [], servicios = []) {
      this.id = id;
      this.nombre = nombre;
      this.email = email;
      this.password = password;
      this.telefono = telefono;
      this.direccion = direccion;
      this.tipo = tipo;
      this.historial = historial;
      this.servicios = Array.isArray(servicios) ? servicios : []; // Asegurar que siempre es un array
    }
  
    /**
     * Agrega un servicio a la lista de servicios del usuario.
     * @param {Servicio} servicio
     */
    agregarServicio(servicio) {
      if (servicio instanceof Servicio && servicio.usuarioId === this.id) {
        this.servicios.push(servicio.id);
      } else {
        console.error("No se puede agregar el servicio: el usuario no coincide");
      }
    }
  }
  
  export class Servicio {
    /**
     * @param {number} id
     * @param {string} nombre
     * @param {string} descripcion
     * @param {number} precio
     * @param {number} valoracion
     * @param {string} ubicacion
     * @param {string} horarios
     * @param {string} metodoPago
     * @param {string} categoria
     * @param {string} imagen
     * @param {Array<string>} etiquetas
     * @param {number} usuarioId
     * @param {string} emailUsuario
     */
    constructor(id, nombre, descripcion, precio, valoracion, ubicacion, horarios, metodoPago, categoria, imagen, etiquetas = [], usuarioId, emailUsuario) {
      this.id = id;
      this.nombre = nombre;
      this.descripcion = descripcion;
      this.precio = precio;
      this.valoracion = valoracion || 0;
      this.ubicacion = ubicacion;
      this.horarios = horarios;
      this.metodoPago = metodoPago;
      this.categoria = categoria;
      this.imagen = imagen;
      this.etiquetas = Array.isArray(etiquetas) ? etiquetas : [];
      this.usuarioId = usuarioId;
      this.emailUsuario = emailUsuario;
    }
  }
  