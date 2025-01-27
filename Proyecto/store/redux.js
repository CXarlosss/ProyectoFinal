import { Servicio } from "../clases/clase-servicio.js";
import { Usuario } from "../clases/clase-usuario.js";

/**
 * Tipos de acciones que maneja el reducer.
 * @typedef {Object} ActionType
 * @property {string} type - Tipo de acción.
 * @property {Usuario | Servicio | string} [payload] - Datos enviados con la acción.
 */

export const ACTION_TYPES = {
  ADD_USER: "ADD_USER",
  ADD_SERVICE: "ADD_SERVICE",
  REMOVE_USER: "REMOVE_USER",
  REMOVE_SERVICE: "REMOVE_SERVICE",
  FILTER_SERVICES: "FILTER_SERVICES",
  SHOW_SERVICE: "SHOW_SERVICE",
};

/**
 * Estado inicial de la aplicación.
 * @typedef {Object} State
 * @property {Usuario[]} usuarios - Lista de usuarios.
 * @property {Servicio[]} servicios - Lista de servicios.
 * @property {Servicio[]} serviciosFiltrados - Lista de servicios filtrados.
 * @property {Servicio | null} servicioMostrado - Servicio actualmente mostrado.
 */

/** @type {State} */
const INITIAL_STATE = {
  usuarios: [],
  servicios: [],
  serviciosFiltrados: [],
  servicioMostrado: null,
};

/**
 * Reducer principal de la aplicación.
 * @param {State} state - Estado actual.
 * @param {ActionType} action - Acción que modifica el estado.
 * @returns {State} - Nuevo estado.
 */
export const appReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ACTION_TYPES.ADD_USER:
      if (action.payload instanceof Usuario) {
        return {
          ...state,
          usuarios: [...state.usuarios, action.payload],
        };
      }
      console.error("Payload inválido para ADD_USER");
      return state;

    case ACTION_TYPES.ADD_SERVICE:
      if (action.payload instanceof Servicio) {
        return {
          ...state,
          servicios: [...state.servicios, action.payload],
        };
      }
      console.error("Payload inválido para ADD_SERVICE");
      return state;

    case ACTION_TYPES.REMOVE_USER:
      if (typeof action.payload === "string") {
        return {
          ...state,
          usuarios: state.usuarios.filter(
            (usuario) => String(usuario.id) !== String(action.payload)
          ),
        };
      }
      console.error("Payload inválido para REMOVE_USER");
      return state;

    case ACTION_TYPES.REMOVE_SERVICE:
      if (typeof action.payload === "string") {
        return {
          ...state,
          servicios: state.servicios.filter(
            (servicio) => servicio.id !== Number(action.payload)
          ),
        };
      }
      console.error("Payload inválido para REMOVE_SERVICE");
      return state;

    case ACTION_TYPES.FILTER_SERVICES:
      if (typeof action.payload === "string") {
        return {
          ...state,
          serviciosFiltrados: state.servicios.filter((servicio) =>
            servicio.nombre.toLowerCase().includes(typeof action.payload === "string" ? action.payload.toLowerCase() : "")
          ),
        };
      }
      console.error("Payload inválido para FILTER_SERVICES");
      return state;

    case ACTION_TYPES.SHOW_SERVICE:
      if (typeof action.payload === "string" || typeof action.payload === "number") {
        const id = Number(action.payload);
        return {
          ...state,
          servicioMostrado: state.servicios.find((servicio) => servicio.id === id) || null,
        };
      }
      console.error("SHOW_SERVICE recibió un payload no válido:", action.payload);
      return state;

    default:
      return state;
  }
}
/**
 * @typedef {object} publicMethods  
 * @property {Function} getState
 * @property {Function} addUser
 * @property {Function} addService
 * @property {Function} removeUser
 * @property {Function} removeService
 * @property {Function} filterServices
 */
/**
 * @typedef {object} store
 * @property {Function} getState
 * @property {publicMethods} article
*/
/**
 * Crea el store con métodos de acceso y manejo de acciones.
 * @param {Function} reducer - Reducer principal de la aplicación.
 * @returns {Store} - Métodos del store.
 */
const createStore = (reducer) => {
  let currentState = reducer(undefined, {});

  // Obtener el estado actual.
  const getState = () => currentState;

  // Manejar una acción y actualizar el estado.
  const _dispatch = (action) => {
    const previousState = currentState;
    currentState = reducer(currentState, action);
    window.dispatchEvent(
      new CustomEvent("stateChanged", {
        detail: {
          changes: _getDifferences(previousState, currentState),
        },
        bubbles: true,
        cancelable: true,
      })
    );
  };

  // Obtener las diferencias entre dos estados.
  const _getDifferences = (previousState, currentState) => {
    return Object.keys(currentState).reduce((diff, key) => {
      if (previousState[key] !== currentState[key]) {
        diff[key] = currentState[key];
      }
      return diff;
    }, {});
  };

  // Acciones disponibles para interactuar con el estado.
  const addUser = (usuario) => _dispatch({ type: ACTION_TYPES.ADD_USER, payload: usuario });
  const addService = (servicio) => _dispatch({ type: ACTION_TYPES.ADD_SERVICE, payload: servicio });
  const removeUser = (id) => _dispatch({ type: ACTION_TYPES.REMOVE_USER, payload: id });
  const removeService = (id) => _dispatch({ type: ACTION_TYPES.REMOVE_SERVICE, payload: id });
  const filterServices = (query) => _dispatch({ type: ACTION_TYPES.FILTER_SERVICES, payload: query });
  const showService = (id) => _dispatch({ type: ACTION_TYPES.SHOW_SERVICE, payload: id });

  return {
    getState,
    addUser,
    addService,
    removeUser,
    removeService,
    filterServices,
    showService,
  };
};

// Crear y exportar el store.
export const store = createStore(appReducer);
