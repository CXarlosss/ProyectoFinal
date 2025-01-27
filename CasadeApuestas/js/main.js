//@ts-check

/**
 * Función para realizar una puja.
 * @param {number} itemId - El ID del artículo a pujar.
 */
function placeBid(itemId) {
    try {
        // Obtener el precio actual y la puja ingresada
        const currentPriceElement = /** @type {HTMLElement | null} */ (
            document.getElementById(`current-price-${itemId}`)
        );
        const bidInput = /** @type {HTMLInputElement | null} */ (
            document.getElementById(`bid-${itemId}`)
        );

        // Verificar si los elementos existen en el DOM
        if (!currentPriceElement || !bidInput) {
            throw new Error("Elementos no encontrados en el DOM.");
        }

        // Convertir los valores a números
        const currentPrice = parseFloat(currentPriceElement.textContent || "0");
        const bidValue = parseFloat(bidInput.value);

        // Validar que la puja sea válida
        if (isNaN(bidValue) || bidValue <= currentPrice) {
            throw new Error("La puja debe ser un número válido mayor al precio actual.");
        }

        // Actualizar el precio actual en el DOM
        currentPriceElement.textContent = bidValue.toFixed(2);

        // Vaciar el campo de la puja
        bidInput.value = "";

        // Confirmación al usuario
        alert(`Has pujado ${bidValue.toFixed(2)} € por el artículo ${itemId}.`);
    } catch (error) {
        // Manejar errores y mostrar mensajes en consola y al usuario
        console.error(error.message);
        alert("Ha ocurrido un error al realizar la puja. Inténtalo de nuevo.");
    }
}
