// @ts-check

import { simpleFetch } from "../lib/simpleFetch.js";
import { HttpError } from "../classes/HttpError.js";
document.addEventListener("DOMContentLoaded", () => {
   
    const servicioContainer =  /** @type {HTMLDivElement | null} */document.getElementById("servicio-container");

    if (!servicioContainer) {
        console.error("❌ No se encontró el contenedor de servicio en el DOM.");
        return;
    }
    const urlParams = new URLSearchParams(window.location.search);
    const servicioId = urlParams.get("_id");
    
    console.log("📌 _id del servicio obtenido de la URL:", servicioId);
    
    if (!servicioId) {
        console.error("❌ No se encontró el _id del servicio en la URL.");
    }
    

     async function getAPIData(apiURL = "api/servicios.json") {
        let apiData;
    
        try {
          apiData = await simpleFetch(apiURL, {
            // Si la petición tarda demasiado, la abortamos
            signal: AbortSignal.timeout(3000),
            headers: {
              "Content-Type": "application/json",
              // Add cross-origin header
              "Access-Control-Allow-Origin": "*",
            },
          });
        } catch (/** @type {any | HttpError} */ err) {
          if (err.name === "AbortError") {
            console.error("Fetch abortado");
          }
          if (err instanceof HttpError) {
            if (err.response.status === 404) {
              console.error("Not found");
            }
            if (err.response.status === 500) {
              console.error("Internal server error");
            }
          }
        }
    
        return apiData;
      }
    
    /**
     * Carga un servicio desde localStorage y lo muestra en la interfaz.
     */
    async function cargarServicioDesdeAPI() {
      try {
          console.log("🔄 Cargando servicio desde la API backend...");
  
          // ✅ Obtener servicios solo desde la API backend (Express)
          const serviciosAPI = await getAPIData(`http://${location.hostname}:3001/read/servicios`);
  
          if (!Array.isArray(serviciosAPI)) {
              throw new Error("⚠️ La API no devolvió un array válido de servicios.");
          }
  
          console.log("📌 Servicios cargados desde la API:", serviciosAPI);
  
          // ✅ Buscar el servicio con el _id de la URL
          const urlParams = new URLSearchParams(window.location.search);
          const servicioId = urlParams.get("_id");
  
          if (!servicioId) {
              console.error("❌ No se encontró el _id del servicio en la URL.");
              return;
          }
  
          /** @type {typeof serviciosAPI[0] | undefined} */
          const servicio = serviciosAPI.find(serv => serv._id.toString() === servicioId);
  
          console.log("📌 Buscando servicio con _id:", servicioId);
          console.log("📌 Servicio encontrado:", servicio);
  
          if (!servicio) {
              servicioContainer && (servicioContainer.innerHTML = `
                  <div class="error-message">
                      <p>❌ El servicio con _id <code>${servicioId}</code> no se encuentra en la lista de servicios.</p>
                      <p>Por favor, verifica el _id o vuelve a la lista de servicios.</p>
                  </div>
              `);
              return;
          }
  
          // ✅ Renderizar la información del servicio encontrado
          servicioContainer && (servicioContainer.innerHTML = `
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
                  <button _id="btn-ir-chat">Enviar Mensaje</button>
                  <button _id="btn-volver">⬅️ Volver a Servicios</button>
              </div>
              <div class="servicio-imagen">
                  <img src="${servicio.imagen || 'default.jpg'}" alt="Imagen del servicio">
              </div>
          `);
  
          // ✅ Configurar botones de navegación
          const btnIrChat = /** @type {HTMLButtonElement | null} */ document.getElementById("btn-ir-chat");
          const btnVolver = /** @type {HTMLButtonElement | null} */ document.getElementById("btn-volver");
  
          if (btnIrChat) {
              btnIrChat.addEventListener("click", () => {
                  localStorage.setItem("servicioSeleccionado", JSON.stringify(servicio));
                  window.location.href = `paginadelusuario.html?servicioId=${encodeURIComponent(servicio._id)}&servicioNombre=${encodeURIComponent(servicio.nombre)}`;
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

    cargarServicioDesdeAPI();
});

