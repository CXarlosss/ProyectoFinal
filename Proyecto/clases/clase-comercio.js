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

