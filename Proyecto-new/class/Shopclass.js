// @ts-check

/**
 * @typedef {Object} UsuarioParams
 * @property {string} nombre
 * @property {string} email
 * @property {string} rol
*/

export class Usuario {
  /**
   * @param {UsuarioParams} param0
   */
  constructor({ nombre, email, rol }) {
    const timestamp = new Date();
    this.id = `${nombre}_${String(timestamp.getTime())}`;
    this.nombre = nombre;
    this.email = email;
    this.rol = rol;
  }
}
  
  // Mixin / Herencia
  /**
   * @typedef {Object} ComercioParams
   * @property {string} nombre
   * @property {string} direccion
   * @property {Array<{ nombre: string }>} [servicios=[]]
   */
  
  /**
   * @extends {Usuario}
   */
  export class Comercio extends Usuario {
  direccion;
  servicios;

  /**
   * @constructor
   * @param {ComercioParams & UsuarioParams} param0
   */
  constructor({ nombre, email, rol, direccion, servicios = [] }) {
    super({ nombre, email, rol });
    this.direccion = direccion;
    this.servicios = servicios;
  }

  /**
   * Agrega un nuevo servicio al comercio.
   * @param {{ nombre: string }} servicio
   */
  agregarServicio(servicio) {
    this.servicios.push(servicio);
  }

  /**
   * Elimina un servicio del comercio por su nombre.
   * @param {string} nombreServicio
   */
  eliminarServicio(nombreServicio) {
    this.servicios = this.servicios.filter((servicio) => servicio.nombre !== nombreServicio);
  }
}
  
  // Factoría
  export const ENTITY_TYPES = {
    USUARIO: 'usuario',
    COMERCIO: 'comercio',
  };
  
  export class EntityFactory {
    /**
     * @param {{ type: string, entityData: UsuarioParams | (ComercioParams & UsuarioParams) }} options
     * @returns {Usuario | Comercio}
     */
    create({ type, entityData }) {
      switch (type) {
        case ENTITY_TYPES.COMERCIO:
          if (!('direccion' in entityData)) {
            throw new Error('Missing property direccion for Comercio');
          }
          return new Comercio(entityData);
        case ENTITY_TYPES.USUARIO:
        default:
          return new Usuario(entityData);
      }
    }
  }
