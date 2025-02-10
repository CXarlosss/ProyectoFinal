// @ts-check
import { Servicio, Usuario } from "../clases/class.js";

/**
 * Tipos de acciones que maneja el reducer.
 * @typedef {Object} ActionType
 * @property {string} type - Tipo de acción.
 * @property {Usuario | Servicio | number | string | null} [payload] - Datos enviados con la acción.
 */


 

export const ACTION_TYPES = {
  ADD_USER: "ADD_USER",
  ADD_SERVICE: "ADD_SERVICE",
  REMOVE_USER: "REMOVE_USER",
  REMOVE_SERVICE: "REMOVE_SERVICE",
  FILTER_SERVICES: "FILTER_SERVICES",
  SHOW_SERVICE: "SHOW_SERVICE",
  SAVE_USER: "SAVE_USER",
  LOAD_SERVICES: "LOAD_SERVICES",
};

/**
 * Estado inicial de la aplicación.
 * @typedef {Object.<(string),any>} State
 * @property {Usuario[]} usuarios - Lista de usuarios registrados.
 * @property {Servicio[]} servicios - Lista de servicios creados.
 * @property {Servicio[]} serviciosFiltrados - Lista de servicios filtrados.
 * @property {Servicio | null} servicioMostrado - Servicio actualmente seleccionado.
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
        return { ...state, usuarios: [...state.usuarios, action.payload] };
      }
      console.error("Payload inválido para ADD_USER");
      return state;

    case ACTION_TYPES.ADD_SERVICE:
      if (action.payload instanceof Servicio) {
        return { ...state, servicios: [...state.servicios, action.payload] };
      }
      console.error("Payload inválido para ADD_SERVICE");
      return state;

    case ACTION_TYPES.REMOVE_USER:
      if (typeof action.payload === "number") {
        return {
          ...state,
          usuarios: state.usuarios.filter((/** @type {{ _id: string | number | Usuario | Servicio | null | undefined; }} */ usuario) => usuario._id !== action.payload),
          servicios: state.servicios.filter((/** @type {{ usuarioId: string | number | Usuario | Servicio | null | undefined; }} */ servicio) => servicio.usuarioId !== action.payload),
        };
      }
      console.error("Payload inválido para REMOVE_USER");
      return state;

    case ACTION_TYPES.REMOVE_SERVICE:
      if (typeof action.payload === "number") {
        return {
          ...state,
          servicios: state.servicios.filter((/** @type {{ _id: string | number | Usuario | Servicio | null | undefined; }} */ servicio) => servicio._id !== action.payload),
        };
      }
      console.error("Payload inválido para REMOVE_SERVICE");
      return state;

      case ACTION_TYPES.FILTER_SERVICES:
        if (typeof action.payload === "string") {
          const searchTerm = action.payload.toLowerCase(); // ✅ Garantizamos que es string antes de usar toLowerCase()
          return {
            ...state,
            serviciosFiltrados: state.servicios.filter((/** @type {{ nombre: string; }} */ servicio) =>
              servicio.nombre.toLowerCase().includes(searchTerm)
            ),
          };
        }
        console.error("Payload inválido para FILTER_SERVICES");
        return state;

    case ACTION_TYPES.SHOW_SERVICE:
      if (typeof action.payload === "number") {
        return {
          ...state,
          servicioMostrado: state.servicios.find((/** @type {{ _id: string | number | Usuario | Servicio | null | undefined; }} */ servicio) => servicio._id === action.payload) || null,
        };
      }
      console.error("SHOW_SERVICE recibió un payload no válido:", action.payload);
      return state;

    case ACTION_TYPES.SAVE_USER:
      if (action.payload instanceof Usuario) {
        return { ...state, usuarios: [...state.usuarios, action.payload] };
      }
      console.error("Payload inválido para SAVE_USER");
      return state;
    case ACTION_TYPES.LOAD_SERVICES:
        if (Array.isArray(action.payload)) {
          return { ...state, servicios: action.payload }; // ✅ Sobreescribimos los servicios
        }
        console.error("Payload inválido para LOAD_SERVICES");
        return state;

    default:
      return state;
  }
};

/**
 * @typedef {Object} PublicMethods
 * @property {function} create,
 * @property {function} update,
 * @property {function} delete
 * @property {function} getById,
 * @property {function} getAll
 * @property {function} deleteAll,
 * @property {(servicios: Servicio[]) => void} loadServices
 * @property {(url: string) => Promise<void>} loadServicesFromAPI
 * @property {function} read
 * 
 * 
 */

/**
 * @typedef {Object} PublicUser
 * @property {(usuario: Usuario) => void} login
 * @property {() => void} logout
 */

/**
 * @typedef {Object} Store
 * @property {() => State} getState
 * @property {PublicMethods} article
 * @property {PublicUser} user
 */

/**
 * Crea el store con métodos de acceso y manejo de acciones.
 * @param {(state: State, action: ActionType) => State} reducer
 * @returns {Store}
 */
const createStore = (reducer) => {
  if (typeof reducer !== "function") {
    throw new TypeError("El parámetro 'reducer' debe ser una función");
  }

  /** @type {State} */
  let currentState = reducer(INITIAL_STATE, { type: "", payload: null });

  /**
   * Obtiene el estado actual.
   * @returns {State}
   */
  const getState = () => currentState;

  /**
   * Despacha una acción para actualizar el estado.
   * @param {ActionType} action
   * @param {() => void} [onEventDispatched]
   */
  const _dispatch = (action, onEventDispatched) => {
    if (!action || typeof action.type !== "string") {
      console.error("Acción inválida:", action);
      return;
    }

    try {
      const previousState = { ...currentState };
      currentState = reducer(currentState, action);

      window.dispatchEvent(
        new CustomEvent("stateChanged", {
          detail: { type: action.type, changes: _getDifferences(previousState, currentState) },
          bubbles: true,
          cancelable: true,
        })
      );

      if (onEventDispatched) onEventDispatched();
    } catch (error) {
      console.error("Error al despachar acción:", error);
    }
  };
/** 
 * @param {State} previousValue - Estado anterior.
 * @param {State} currentValue - Estado actual.
 * @returns {Object} - Diferencias entre los estados.
 */
const _getDifferences = (previousValue, currentValue) => {
  return Object.keys(currentValue).reduce((diff, key) => {
      if (previousValue[key] === currentValue[key]) return diff
      return {
          ...diff,
          [key]: currentValue[key]
      };
  }, {});
}
  /** @type {PublicMethods} */
  const article = {
    create: (/** @type {any} */ servicio) => _dispatch({ type: "ADD_SERVICE", payload: servicio }),
    update: (/** @type {any} */ servicio) => _dispatch({ type: "UPDATE_SERVICE", payload: servicio }),
    delete: (/** @type {any} */ _id) => _dispatch({ type: "REMOVE_SERVICE", payload: _id }),
    getById: (/** @type {any} */ _id) => currentState.servicios.find((/** @type {{ _id: any; }} */ servicio) => servicio._id === _id),
    getAll: () => currentState.servicios,
    deleteAll: () => _dispatch({ type: "DELETE_ALL_SERVICES" }),
    loadServices: (/** @type {any} */ servicios) => _dispatch({ type: "LOAD_SERVICES", payload: servicios }),

    /**
     * Carga servicios desde una API o JSON local y los guarda en el store.
     * @param {string} url - URL del archivo JSON o API.
     * @returns {Promise<void>}
     */
    async loadServicesFromAPI(url) {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Error al cargar servicios: ${response.status}`);
        }

        const { servicios } = await response.json();
        article.loadServices(servicios);
        window.dispatchEvent(new CustomEvent("stateChanged"));
      } catch (error) {
        console.error("Error al cargar los servicios desde la API:", error);
      }
    },

    read: (/** @type {any} */ _id) => currentState.servicios.find((/** @type {{ _id: any; }} */ servicio) => servicio._id === _id),
  };

  /** @type {PublicUser} */
  const user = {
    login: (usuario) => _dispatch({ type: "LOGIN", payload: usuario }),
    logout: () => _dispatch({ type: "LOGOUT" }),
  };

  return { getState, article, user };
};
export const store = createStore(appReducer);

// ✅ Exportamos la función correctamente
export const loadServicesFromAPI = store.article.loadServicesFromAPI;
