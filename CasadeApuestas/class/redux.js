// redux.js
//@ts-check
import { Articulo } from './Articulo.js';

/**
 * Estado inicial de la aplicación.
 */
const INITIAL_STATE = {
  articles: /** @type {Articulo[]} */ ([]),
};

/**
 * Tipos de acciones.
 */
const ACTION_TYPES = {
  CREATE_ARTICLE: 'CREATE_ARTICLE',
  DELETE_ARTICLE: 'DELETE_ARTICLE',
};

/**
 * Reducer para manejar el estado global.
 * @param {typeof INITIAL_STATE} state
 * @param {{ type: string, article?: Articulo }} action
 * @returns {typeof INITIAL_STATE}
 */
function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case ACTION_TYPES.CREATE_ARTICLE:
      return {
        ...state,
        articles: action.article ? [...state.articles, action.article] : state.articles,
      };
    case ACTION_TYPES.DELETE_ARTICLE:
      return {
        ...state,
        articles: state.articles.filter((article) => article.id !== action.article?.id),
      };
    default:
      return state;
  }
}

/**
 * Store de la aplicación.
 */
export const store = (() => {
  let currentState = INITIAL_STATE;

  const dispatch = (action) => {
    currentState = reducer(currentState, action);
    const event = new CustomEvent('stateChanged', { detail: { state: currentState } });
    window.dispatchEvent(event);
  };

  const getState = () => currentState;

  return { dispatch, getState };
})();

/**
 * Acción para crear un artículo.
 * @param {Articulo} article
 */
export function createArticulo(article) {
  store.dispatch({ type: ACTION_TYPES.CREATE_ARTICLE, article });
}

/**
 * Acción para eliminar un artículo.
 * @param {Articulo} article
 */
export function deleteArticulo(article) {
  store.dispatch({ type: ACTION_TYPES.DELETE_ARTICLE, article });
}