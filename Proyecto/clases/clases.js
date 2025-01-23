export class ComercioActividad {
  /**
   * @param {Number} id
   * @param {String} nombre
   * @param {String} descripcion
   * @param {Number} precio
   * @param {Number} valoracion
   * @param {String} ubicacion
   * @param {String} horarios
   * @param {String} metodoPago
   * @param {String} categoria
   * @param {String} imagen
   * @param {Array<ComercioActividad>} actividades
   */
  constructor(id, nombre, descripcion, precio, valoracion, ubicacion, horarios, metodoPago, categoria, imagen, actividades) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precio = precio;
    this.valoracion = valoracion;
    this.ubicacion = ubicacion;
    this.horarios = horarios;
    this.metodoPago = metodoPago;
    this.categoria = categoria;
    this.imagen = imagen;
    this.actividades = actividades || [];
  }
}

export class Usuario {
  /**
   * @param {Number} id
   * @param {String} nombre
   * @param {String} email
   * @param {String} password
   * @param {String} telefono
   * @param {String} direccion
   * @param {String} tipo
   * @param {Array<Object>} historial
   */
  constructor(id, nombre, email, password, telefono, direccion, tipo = "cliente", historial = []) {
    this.id = id;
    this.nombre = nombre;
    this.email = email;
    this.password = password;
    this.telefono = telefono;
    this.direccion = direccion;
    this.tipo = tipo;
    this.historial = historial;
  }
}
