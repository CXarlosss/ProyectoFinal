// @ts-check

document.addEventListener("DOMContentLoaded", async () => {
  const servicioContainer = /** @type {HTMLDivElement | null} */ document.getElementById("servicio-container");
const API_PORT = location.port ? `:${location.port}` : ''
  if (!servicioContainer) {
      console.error("❌ No se encontró el contenedor de servicio en el DOM.");
      return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const servicioId = urlParams.get("_id");

  console.log("📌 _id del servicio obtenido de la URL:", servicioId);

  if (!servicioId) {
      console.error("❌ No se encontró el _id del servicio en la URL.");
      return;
  }

  /**
   * Carga el servicio desde el servidor MongoDB y lo muestra en la UI.
   */
  async function cargarServicioDesdeAPI() {
      try {
          console.log("🔄 Cargando servicio desde la API backend...");

          // @ts-ignore
          const response = await fetch(`${location.protocol}//${location.hostname}${API_PORT}/api/read/servicio/${encodeURIComponent(servicioId)}`);

          if (!response.ok) {
              throw new Error(`❌ Error al obtener el servicio (HTTP ${response.status})`);
          }

          const servicio = await response.json();
          console.log("📌 Servicio encontrado:", servicio);

          if (!servicio) {
              // @ts-ignore
              servicioContainer.innerHTML = `
                  <div class="error-message">
                      <p>❌ El servicio con _id <code>${servicioId}</code> no se encuentra en la base de datos.</p>
                      <p>Por favor, verifica el _id o vuelve a la lista de servicios.</p>
                  </div>
              `;
              return;
          }

          // ✅ Renderizar la información del servicio en la UI
          // @ts-ignore
          servicioContainer.innerHTML = `
              <div class="servicio-info">
                  <h2>${servicio.nombre}</h2>
                  <p><strong>Descripción:</strong> ${servicio.descripcion}</p>
                  <p><strong>Ubicación:</strong> ${servicio.ubicacion}</p>
                  <p><strong>Valoración:</strong> ${servicio.valoracion || "No valorado"}</p>
                  <p><strong>Precio:</strong> ${servicio.precio ? `$${servicio.precio}` : "No especificado"}</p>
                  <p><strong>Horarios:</strong> ${servicio.horarios || "No disponible"}</p>
                  <p><strong>Método de Pago:</strong> ${servicio.metodoPago || "No especificado"}</p>
                  <p><strong>Etiquetas:</strong> ${servicio.etiquetas || "No definidas"}</p>
                  <p><strong>Contacto:</strong> <a href="mailto:${servicio.emailUsuario}">${servicio.emailUsuario || "No disponible"}</a></p>
                  <button id="btn-ir-chat">Enviar Mensaje</button>
                  <button id="btn-volver">⬅️ Volver a Servicios</button>
              </div>
              <div class="servicio-imagen">
                  <img src="${servicio.imagen || 'default.jpg'}" alt="Imagen del servicio">
              </div>
          `;

          // ✅ Configurar eventos para los botones
          const btnIrChat = /** @type {HTMLButtonElement | null} */ document.getElementById("btn-ir-chat");
          const btnVolver = /** @type {HTMLButtonElement | null} */ document.getElementById("btn-volver");

         
            if (btnIrChat) {
                btnIrChat.addEventListener("click", () => {
                    // Guardamos el servicio en localStorage y redirigimos a la página de mensajes
                    localStorage.setItem("servicioSeleccionado", JSON.stringify(servicio));
                    window.location.href = `paginadelusuario.html`;
                });
            }

          if (btnVolver) {
              btnVolver.addEventListener("click", () => {
                  window.location.href = `servicios.html`;
              });
          }

      } catch (error) {
          console.error("🚨 Error al cargar el servicio:", error);
      }
  }

  await cargarServicioDesdeAPI();
});
