export class Servicio {
  /**
   * @param {number} id - Identificador único del servicio
   * @param {string} nombre - Nombre del servicio
   * @param {string} descripcion - Breve descripción del servicio
   * @param {number} precio - Precio estimado del servicio
   * @param {number} valoracion - Valoración promedio del servicio (1-5)
   * @param {string} ubicacion - Ubicación del proveedor o área de servicio
   * @param {string} horarios - Horarios en los que se ofrece el servicio
   * @param {string} metodoPago - Métodos de pago aceptados (ej: "Efectivo, Tarjeta")
   * @param {string} categoria - Categoría del servicio (ej: "Cuidado personal", "Reparaciones")
   * @param {string} imagen - URL de la imagen asociada al servicio
   * @param {Array<string>} etiquetas - Etiquetas asociadas al servicio para facilitar la búsqueda
   */
  constructor(
    id,
    nombre,
    descripcion,
    precio,
    valoracion,
    ubicacion,
    horarios,
    metodoPago,
    categoria,
    imagen,
    etiquetas = []
  ) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precio = precio;
    this.valoracion = valoracion || 0; // Valor por defecto
    this.ubicacion = ubicacion;
    this.horarios = horarios;
    this.metodoPago = metodoPago;
    this.categoria = categoria;
    this.imagen = imagen;
    this.etiquetas = etiquetas;
  }
}