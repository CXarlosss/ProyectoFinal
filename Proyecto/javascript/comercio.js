document.addEventListener('DOMContentLoaded', () => {
    assignCircuitListeners();

    // Datos simulados de comercios
    const comercios = [
      {
        id: 1,
        nombre: "Comercio 1",
        descripcion: "Descripción del Comercio 1",
        ubicacion: "Calle Principal 123",
        horario: "9:00 AM - 9:00 PM",
        categoria: "Ropa",
        valoracion: 4.5,
      },
      {
        id: 2,
        nombre: "Comercio 2",
        descripcion: "Descripción del Comercio 2",
        ubicacion: "Avenida Secundaria 456",
        horario: "10:00 AM - 8:00 PM",
        categoria: "Electrónica",
        valoracion: 4.7,
      },
    ];

    // Renderizar tarjetas con los datos de los comercios
    renderCommerceCards(comercios);
  });

  /**
   * Renderiza dinámicamente las tarjetas de comercios.
   * @param {Array<Object>} comercios - Lista de comercios.
   */
  function renderCommerceCards(comercios) {
    const circuitList = document.getElementById("circuit-list");
    if (!circuitList) return;

    // Limpiar el contenedor
    circuitList.innerHTML = "";

    comercios.forEach((comercio) => {
      const card = document.createElement("article");
      card.className = "__circuit-header-card";

      // Contenido del comercio
      card.innerHTML = `
        <header>
          <h3>${comercio.nombre}</h3>
          <p><strong>Ubicación:</strong> ${comercio.ubicacion}</p>
        </header>
        <div class="__circuit-extended-info __hidden">
          <p><strong>Descripción:</strong> ${comercio.descripcion}</p>
          <p><strong>Horario:</strong> ${comercio.horario}</p>
          <p><strong>Categoría:</strong> ${comercio.categoria}</p>
          <p><strong>Valoración:</strong> ${comercio.valoracion} ⭐</p>
        </div>
      `;

      circuitList.appendChild(card);
    });

    // Asignar listeners después de renderizar
    assignCircuitListeners();
  }

  /**
   * Asigna listeners para alternar información extendida de cada comercio.
   */
  function assignCircuitListeners() {
    /** @type {HTMLCollectionOf<Element>} */
    const circuitCards = document.getElementsByClassName("__circuit-header-card");
    for (let i of circuitCards) {
      /** @type {HTMLElement} */ (i).addEventListener("click", showCircuitExtendedCard);
    }
  }

  /**
   * Muestra u oculta la información extendida del comercio.
   * @param {MouseEvent} e 
   */
  function showCircuitExtendedCard(e) {
    const eventTarget = /** @type {HTMLElement} */ (e.target);
    const extendedInfo = eventTarget.closest("article")?.querySelector(".__circuit-extended-info");

    if (extendedInfo?.classList.contains("__hidden")) {
      extendedInfo.classList.remove("__hidden");
    } else {
      extendedInfo?.classList.add("__hidden");
    }
  }