export class Usuario {
  /**
   * @param {string} _id // ID único del usuario
   * @param {string} nombre
   * @param {string} email
   * @param {string} password
   * @param {string} telefono
   * @param {string} direccion
   * @param {string} tipo - Tipo de usuario (por defecto "cliente")
   * @param {Array<Object>} historial
   * @param {Array<string>} servicios - Lista de IDs de los servicios que ofrece el usuario
   * @param {Array<string>} favoritos - Lista de IDs de servicios marcados como favoritos
   */
  constructor(_id, nombre, email, password, telefono, direccion, tipo = "cliente", historial = [], servicios = [], favoritos = []) {
      this._id = _id;
      this.nombre = nombre;
      this.email = email;
      this.password = password;
      this.telefono = telefono;
      this.direccion = direccion;
      this.tipo = tipo;
      this.historial = historial;
      this.servicios = Array.isArray(servicios) ? servicios : []; // Asegurar que siempre es un array
      this.favoritos = Array.isArray(favoritos) ? favoritos : []; // Almacenar servicios favoritos
  }

  /**
   * Agrega un servicio a la lista de servicios del usuario.
   * @param {Servicio} servicio
   */
  agregarServicio(servicio) {
      if (servicio instanceof Servicio && servicio.usuarioId === this._id) {
          this.servicios.push(servicio._id);
      } else {
          console.error("No se puede agregar el servicio: el usuario no coincide");
      }
  }

  /**
   * Agrega un servicio a la lista de favoritos del usuario.
   * @param {string} servicioId - ID del servicio a marcar como favorito
   */
  agregarFavorito(servicioId) {
      if (!this.favoritos.includes(servicioId)) {
          this.favoritos.push(servicioId);
          console.log(`Servicio ${servicioId} añadido a favoritos.`);
      } else {
          console.warn("El servicio ya está en favoritos.");
      }
  }

  /**
   * Elimina un servicio de la lista de favoritos del usuario.
   * @param {string} servicioId - ID del servicio a quitar de favoritos
   */
  eliminarFavorito(servicioId) {
      const index = this.favoritos.indexOf(servicioId);
      if (index !== -1) {
          this.favoritos.splice(index, 1);
          console.log(`Servicio ${servicioId} eliminado de favoritos.`);
      } else {
          console.warn("El servicio no está en favoritos.");
      }
  }
}

export class Servicio {
  /**
   * @param {string} _id  
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
   * @param {string} usuarioId 
   * @param {string} emailUsuario
   * @param {string} mensajePredeterminado
   */
  constructor(_id, nombre, descripcion, precio, valoracion = 0, ubicacion, horarios, metodoPago, categoria, imagen, etiquetas = [], usuarioId, emailUsuario, mensajePredeterminado) {
      this._id = _id;
      this.nombre = nombre;
      this.descripcion = descripcion;
      this.precio = isNaN(Number(precio)) ? 0 : Number(precio);
      this.valoracion = isNaN(Number(valoracion)) ? 0 : Number(valoracion);
      this.ubicacion = ubicacion;
      this.horarios = horarios;
      this.metodoPago = metodoPago;
      this.categoria = categoria;
      this.imagen = imagen;
      this.etiquetas = Array.isArray(etiquetas) ? etiquetas : etiquetas.split(",").map(tag => tag.trim());
      this.mensajePredeterminado = mensajePredeterminado;
      this.usuarioId = usuarioId;
      this.emailUsuario = emailUsuario;
  }
}

export class Mensaje {
  /**
   * @param {string} _id // ID único del mensaje
   * @param {string} usuarioId // ID del usuario que envía el mensaje
   * @param {string} servicioId // ID del servicio al que se envía el mensaje
   * @param {string} contenido // Contenido del mensaje
   * @param {Date} fecha // Fecha de envío del mensaje
   * @param {boolean} leido // Estado del mensaje (si ha sido leído o no)
   */
  constructor(_id, usuarioId, servicioId, contenido, fecha = new Date(), leido = false) {
      this._id = _id;
      this.usuarioId = usuarioId;
      this.servicioId = servicioId;
      this.contenido = contenido;
      this.fecha = fecha;
      this.leido = leido;
  }

  /**
   * Marca el mensaje como leído.
   */
  marcarComoLeido() {
      this.leido = true;
  }

  /**
   * Formatea la fecha en un formato legible.
   * @returns {string} Fecha formateada.
   */
  obtenerFechaFormateada() {
      return this.fecha.toLocaleString(); // Formato legible según la configuración regional
  }
}
