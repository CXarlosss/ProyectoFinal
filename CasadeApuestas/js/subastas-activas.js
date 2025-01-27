// subastas-activas.js
//@ts-check

import { createArticulo, deleteArticulo, store } from '../class/redux.js';
import { adjustBid } from './AdjustPrice.js';
import { Articulo } from '../class/Articulo.js';

/**
 * Inicializa las subastas activas en el DOM.
 */
function initSubastasActivas() {
  const container = document.querySelector('.container');
  if (!container) return;

  container.innerHTML = '<h2>Explora las Subastas Activas</h2>';

  const { articles } = store.getState();
  articles.forEach((article) => {
    const auctionItem = document.createElement('div');
    auctionItem.classList.add('auction-item');
    auctionItem.id = `item-${article.id}`;
    auctionItem.innerHTML = `
      <img src="${article.imagen}" alt="${article.titulo}">
      <h3>${article.titulo}</h3>
      <p>Precio actual: <span id="current-price-${article.id}">${article.precio}</span> €</p>
      <div>
        <button onclick="adjustBid(${article.id}, -10)">-10 €</button>
        <button onclick="adjustBid(${article.id}, 10)">+10 €</button>
        <button onclick="removeArticulo('${article.id}')">Eliminar</button>
      </div>
    `;
    container.appendChild(auctionItem);
  });
}

/**
 * Elimina un artículo de la subasta.
 * @param {string} id
 */
function removeArticulo(id) {
  const article = store.getState().articles.find((article) => article.id === id);
  if (article) {
    deleteArticulo(article);
    initSubastasActivas();
  }
}

window.onload = () => {
  initSubastasActivas();
  const demoArticle = new Articulo('Demo', 100, 'https://via.placeholder.com/300', 'Artículo de prueba');
  createArticulo(demoArticle);
  initSubastasActivas();
};
