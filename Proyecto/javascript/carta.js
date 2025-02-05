// @ts-check
import { apiConfig } from "../data/singleton.js";
import { simpleFetch } from "../src/lib/simpleFetch.js";
import { HttpError } from "../src/classes/HttpError.js";
document.addEventListener("DOMContentLoaded", () => {
   
    const servicioContainer =  /** @type {HTMLDivElement | null} */document.getElementById("servicio-container");

    if (!servicioContainer) {
        console.error("❌ No se encontró el contenedor de servicio en el DOM.");
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const servicioId = urlParams.get("id");

    if (!servicioId) {
        servicioContainer.innerHTML = "<p>❌ Servicio no encontrado.</p>";
        return;
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
    async function cargarServicioDesdeLocalStorage() {
        try {
            console.log("🔄 Cargando servicios desde la API, JSON y LocalStorage...");
    
            // 1️⃣ Obtener servicios del JSON local
            const response = await fetch(apiConfig.API_SERVICIOS_URL);
            if (!response.ok) throw new Error(`❌ Error al cargar JSON: ${response.status}`);
            const data = await response.json();
            const serviciosJSON = Array.isArray(data) ? data : data.servicios || [];
    
            console.log("📌 Servicios cargados desde JSON:", serviciosJSON);
    
            // 2️⃣ Obtener servicios de la API backend
            const serviciosAPI = await getAPIData(`http://${location.hostname}:1337/read/servicios`);
            console.log("📌 Servicios cargados desde la API:", serviciosAPI);
    
            // 3️⃣ Obtener servicios de LocalStorage
            const serviciosString = localStorage.getItem("servicios");
            const serviciosLocalStorage = serviciosString ? JSON.parse(serviciosString) : [];
            
            console.log("📌 Servicios cargados desde LocalStorage:", serviciosLocalStorage);
    
            // 4️⃣ Combinar los servicios de todas las fuentes en un solo array
            const serviciosTotales = [...serviciosJSON, ...(Array.isArray(serviciosAPI) ? serviciosAPI : []), ...serviciosLocalStorage];
    
            console.log("✅ Todos los servicios combinados:", serviciosTotales);
    
            // 5️⃣ Buscar el servicio con el ID de la URL
            const urlParams = new URLSearchParams(window.location.search);
            const servicioId = urlParams.get("id");
    
            if (!servicioId) {
                console.error("❌ No se encontró el ID del servicio en la URL.");
                return;
            }
    
            /** @type {typeof serviciosTotales[0] | undefined} */
            const servicio = serviciosTotales.find(serv => serv.id.toString() === servicioId);
    
            console.log("📌 Buscando servicio con ID:", servicioId);
            console.log("📌 Servicio encontrado:", servicio);
    
            if (!servicio) {
                servicioContainer && (servicioContainer.innerHTML = `
                    <div class="error-message">
                        <p>❌ El servicio con ID <code>${servicioId}</code> no se encuentra en la lista de servicios.</p>
                        <p>Por favor, verifica el ID o vuelve a la lista de servicios.</p>
                    </div>
                `);
                return;
            }
    
            // 6️⃣ Renderizar la información del servicio encontrado
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
                    <button id="btn-ir-chat">Enviar Mensaje</button>
                    <button id="btn-volver">⬅️ Volver a Servicios</button>
                </div>
                <div class="servicio-imagen">
                    <img src="${servicio.imagen || 'default.jpg'}" alt="Imagen del servicio">
                </div>
            `);

        
       
       // 7️⃣ Configurar botones de navegación
       const btnIrChat = /** @type {HTMLButtonElement | null} */ document.getElementById("btn-ir-chat");
       const btnVolver = /** @type {HTMLButtonElement | null} */ document.getElementById("btn-volver");

       if (btnIrChat) {
           btnIrChat.addEventListener("click", () => {
               localStorage.setItem("servicioSeleccionado", JSON.stringify(servicio));
               window.location.href = `paginadelusuario.html?servicioId=${encodeURIComponent(servicio.id)}&servicioNombre=${encodeURIComponent(servicio.nombre)}`;
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

    cargarServicioDesdeLocalStorage();
});

