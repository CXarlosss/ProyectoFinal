// @ts-check
/**
 * @extends {Error}
 * @property {Response} response
 */
export class HttpError extends Error {
    response
    /**
     * @param {Response} response
     */
    constructor(response) {
      super(`HTTP error ${response.status}`);
      this.response = response
    }
  }