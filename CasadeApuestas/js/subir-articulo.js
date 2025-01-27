//@ts-check

/**
 * Agrega un nuevo artículo a la lista de artículos creados.
 */
function addItem() {
    // Obtener los valores del formulario
    const titleInput = /** @type {HTMLInputElement | null} */ (document.getElementById('title'));
    const priceInput = /** @type {HTMLInputElement | null} */ (document.getElementById('price'));
    const imageInput = /** @type {HTMLInputElement | null} */ (document.getElementById('image'));
    const descriptionInput = /** @type {HTMLTextAreaElement | null} */ (document.getElementById('description'));

    if (!titleInput || !priceInput || !imageInput || !descriptionInput) {
        console.error('No se encontraron los elementos del formulario.');
        return;
    }

    const title = titleInput.value.trim();
    const price = priceInput.value.trim();
    const image = imageInput.value.trim();
    const description = descriptionInput.value.trim();

    // Validar que todos los campos estén llenos
    if (!title || !price || !image || !description) {
        alert('Por favor, completa todos los campos antes de crear el artículo.');
        return;
    }

    // Crear el contenedor del nuevo artículo
    const createdItems = /** @type {HTMLElement | null} */ (document.getElementById('createdItems'));
    if (!createdItems) {
        console.error('El contenedor de artículos creados no existe.');
        return;
    }

    const newItem = document.createElement('div');
    newItem.classList.add('created-item');

    // Agregar el contenido HTML del nuevo artículo
    newItem.innerHTML = `
        <img src="${image}" alt="${title}">
        <h3>${title}</h3>
        <p>Precio Inicial: ${price} €</p>
        <p>${description}</p>
        <button onclick="editItem(this)">Editar</button>
    `;

    // Agregar el nuevo artículo al contenedor
    createdItems.appendChild(newItem);

    // Limpiar el formulario
    titleInput.value = '';
    priceInput.value = '';
    imageInput.value = '';
    descriptionInput.value = '';
}

/**
 * Permite editar un artículo creado.
 * @param {HTMLButtonElement} button El botón del artículo a editar.
 */
function editItem(button) {
    const item = button.parentElement;
    if (!item) {
        console.error('No se pudo encontrar el elemento padre del botón.');
        return;
    }

    // Extraer los datos actuales del artículo
    const titleElement = /** @type {HTMLHeadingElement | null} */ (item.querySelector('h3'));
    const priceElement = /** @type {HTMLParagraphElement | null} */ (item.querySelector('p'));
    const descriptionElement = /** @type {HTMLParagraphElement | null} */ (item.querySelectorAll('p')[1]);
    const imageElement = /** @type {HTMLImageElement | null} */ (item.querySelector('img'));

    if (!titleElement || !priceElement || !descriptionElement || !imageElement) {
        console.error('No se encontraron todos los elementos necesarios para editar el artículo.');
        return;
    }

    const title = titleElement.innerText;
    const price = priceElement.innerText.match(/\\d+/)?.[0] || '';
    const description = descriptionElement.innerText;
    const image = imageElement.src;

    // Rellenar los datos en el formulario
    const titleInput = /** @type {HTMLInputElement | null} */ (document.getElementById('title'));
    const priceInput = /** @type {HTMLInputElement | null} */ (document.getElementById('price'));
    const imageInput = /** @type {HTMLInputElement | null} */ (document.getElementById('image'));
    const descriptionInput = /** @type {HTMLTextAreaElement | null} */ (document.getElementById('description'));

    if (!titleInput || !priceInput || !imageInput || !descriptionInput) {
        console.error('No se encontraron los elementos del formulario para editar.');
        return;
    }

    titleInput.value = title;
    priceInput.value = price;
    imageInput.value = image;
    descriptionInput.value = description;

    // Eliminar el artículo actual
    item.remove();
}
