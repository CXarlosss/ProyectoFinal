import { HttpError } from '../clases/HttpError.js';

export async function simpleFetch (url, options) {
  const result = await fetch(url, options);
  if (!result.ok) {
    throw new HttpError(result);
  }
  return (await result.json());
}