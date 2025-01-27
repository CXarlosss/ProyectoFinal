// AdjustPrice.js
//@ts-check

/**
 * Ajusta el precio actual de una subasta.
 * @param {number} itemId - ID del artículo.
 * @param {number} amount - Cantidad a sumar o restar al precio.
 */
export function adjustBid(itemId, amount) {
    const priceElement = document.getElementById(`current-price-${itemId}`);
    let currentPrice = priceElement && priceElement.textContent ? parseFloat(priceElement.textContent) : 0;
  
    // Asegurar que el precio no sea menor a 0
    currentPrice = Math.max(0, currentPrice + amount);
  
    // Actualizar el precio en pantalla
    if (priceElement) {
      priceElement.textContent = currentPrice.toFixed(2);
    }
  
    console.log(`El precio del artículo ${itemId} ahora es ${currentPrice} €.`);
  }
  
  