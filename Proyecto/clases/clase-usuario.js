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
  