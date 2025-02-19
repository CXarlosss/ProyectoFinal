//import { simpleFetch } from "./simpleFetch.js";

/**
 * Importa un template HTML en el body del documento.
 *
 * @param {string} templateUrl URL del template a importar.
 *
 * @returns {Promise<void>} Promise que se resuelve cuando el template se ha importado.
 */
export async function importTemplate(templateUrl) {


  try {
    const response = await fetch(templateUrl);
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

    const templateText = await response.text();
 

    // Crear un documento temporal y extraer los templates
    const parser = new DOMParser();
    const doc = parser.parseFromString(templateText, "text/html");
    const templates = doc.querySelectorAll("template");

    if (!templates.length) {
      
      return;
    }

    // Insertar cada template en el body como un nodo real
    templates.forEach(template => {
      let existingTemplate = document.body.querySelector(`#${template.id}`);

      if (!existingTemplate) {
        let newTemplate = document.createElement("template");
        newTemplate.id = template.id;
        newTemplate.innerHTML = template.innerHTML; // Copia el contenido correctamente
        document.body.appendChild(newTemplate);

      
      }
    });

   
  } catch (error) {
    console.error("❌ Error al importar template:", error);
  }
}
