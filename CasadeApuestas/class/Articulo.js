
export class Articulo {
    /**
     * @param {string} titulo - El título del artículo.
     * @param {number} precio - El precio inicial del artículo.
     * @param {string} imagen - La URL de la imagen del artículo.
     * @param {string} descripcion - La descripción del artículo.
     */
    constructor(titulo, precio, imagen, descripcion) {
      this.titulo = titulo;
      this.precio = precio;
      this.imagen = imagen;
      this.descripcion = descripcion;
      this.id = Articulo.generateId(); // ID único para cada artículo
    }
  
    // Generar un ID único para el artículo
    static generateId() {
      return `articulo-${Date.now() + Math.random()}`;
    }
  }
  
  
  /**
   * Clase para manejar una subasta.
   */
  export class Subasta {
    constructor() {
      this.articulos = []; // Lista de artículos
    }
  
    /**
     * Agregar un nuevo artículo a la subasta.
     * @param {Articulo} articulo - Instancia de la clase Articulo.
     */
    agregarArticulo(articulo) {
      this.articulos.push(articulo);
      this.renderizarArticulo(articulo); // Renderizar el artículo en la página
    }
  
    /**
     * Renderizar un artículo en la interfaz de usuario.
     * @param {Articulo} articulo - El artículo a renderizar.
     */
    renderizarArticulo(articulo) {
      const createdItems = document.getElementById('createdItems');
      if (!createdItems) {
        console.error('No se encontró el contenedor para artículos creados.');
        return;
      }
  
      const newItem = document.createElement('div');
      newItem.classList.add('created-item');
      newItem.setAttribute('id', articulo.id);
  
      newItem.innerHTML = `
        <img src="${articulo.imagen}" alt="${articulo.titulo}">
        <h3>${articulo.titulo}</h3>
        <p>Precio Inicial: ${articulo.precio} €</p>
        <p>${articulo.descripcion}</p>
        <button onclick="editarArticulo('${articulo.id}')">Editar</button>
        <button onclick="eliminarArticulo('${articulo.id}')">Eliminar</button>
      `;
  
      createdItems.appendChild(newItem);
    }
  }
  