import { ComercioActividad as Comercio } from "../clases/clase-comercio.js";
import { Usuario } from "../clases/clase-usuario.js";

/**
 * @typedef {Object} ActionType
 * @property {string} type
 * @property {Usuario | Comercio | string} [payload]
 */

const ACTION_TYPES = {
  ADD_USER: "ADD_USER",
  ADD_COMMERCE: "ADD_COMMERCE",
  REMOVE_USER: "REMOVE_USER",
  REMOVE_COMMERCE: "REMOVE_COMMERCE",
  FILTER_SERVICES: "FILTER_SERVICES",
  SHOW_SERVICE: "SHOW_SERVICE",
};

/**
 * @typedef {Object} State
 * @property {Usuario[]} usuarios
 * @property {Comercio[]} comercios
 * @property {Comercio[]} serviciosFiltrados
 * @property {string | null} servicioMostrado
 */

/** @type {State} */
const INITIAL_STATE = {
  usuarios: [],
  comercios: [],
  serviciosFiltrados: [],
  servicioMostrado: null,
};

/**
 * Reducer para manejar el estado global.
 * @param {State} state - Estado actual.
 * @param {ActionType} action - Acción a reducir.
 * @returns {State} El nuevo estado.
 */
const appReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ACTION_TYPES.ADD_USER:
      return {
        ...state,
        usuarios: action.payload instanceof Usuario ? [...state.usuarios, action.payload] : state.usuarios,
      };
    case ACTION_TYPES.ADD_COMMERCE:
      return {
        ...state,
        comercios: action.payload instanceof Comercio ? [...state.comercios, action.payload] : state.comercios,
      };
    case ACTION_TYPES.REMOVE_USER:
      return {
        ...state,
        usuarios: state.usuarios.filter((usuario) => typeof action.payload === 'number' && usuario.id !== action.payload),
      };
    case ACTION_TYPES.REMOVE_COMMERCE:
      return {
        ...state,
        comercios: state.comercios.filter((comercio) => typeof action.payload === 'number' && comercio.id !== action.payload),
      };
    case ACTION_TYPES.FILTER_SERVICES:
      return {
        ...state,
        serviciosFiltrados: state.comercios.filter((comercio) =>
          comercio.servicios.some((servicio) => servicio.nombre.includes(action.payload))
        ),
      };
    case ACTION_TYPES.SHOW_SERVICE:
      return {
        ...state,
        servicioMostrado: typeof action.payload === 'string' ? action.payload : null,
      };
    default:
      return state;
  }
};

/**
 * Crea el store con métodos de acceso y manejo de acciones.
 * @param {typeof appReducer} reducer
 */
const createStore = (reducer) => {
  let currentState = INITIAL_STATE;

  // Acciones
  const addUser = (usuario) => _dispatch({ type: ACTION_TYPES.ADD_USER, payload: usuario });
  const addCommerce = (comercio) => _dispatch({ type: ACTION_TYPES.ADD_COMMERCE, payload: comercio });
  const removeUser = (id) => _dispatch({ type: ACTION_TYPES.REMOVE_USER, payload: id });
  const removeCommerce = (id) => _dispatch({ type: ACTION_TYPES.REMOVE_COMMERCE, payload: id });
  const filterServices = (query) => _dispatch({ type: ACTION_TYPES.FILTER_SERVICES, payload: query });
  const showService = (servicio) => _dispatch({ type: ACTION_TYPES.SHOW_SERVICE, payload: servicio });

  // Métodos públicos
  const getState = () => currentState;

  // Métodos privados
  /**
   * Maneja la acción y actualiza el estado.
   * @param {ActionType} action
   */
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

  /**
   * Obtiene las diferencias entre dos estados.
   * @param {State} previousState
   * @param {State} currentState
   */
  const _getDifferences = (previousState, currentState) => {
    return Object.keys(currentState).reduce((diff, key) => {
      if (previousState[key] !== currentState[key]) {
        diff[key] = currentState[key];
      }
      return diff;
    }, {});
  };

  return {
    addUser,
    addCommerce,
    removeUser,
    removeCommerce,
    filterServices,
    showService,
    getState,
  };
};

export const store = createStore(appReducer);