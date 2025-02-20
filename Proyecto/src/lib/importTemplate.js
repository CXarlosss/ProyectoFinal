/**
 * Importa un template HTML en el body del documento.
 *
 * @param {string} templateUrl URL del template a importar.
 *
 * @returns {Promise<void>} Promise que se resuelve cuando el template se ha importado.
 */
export async function importTemplate(templateUrl) {
  try {
    console.log(`📌 Intentando importar template desde: ${templateUrl}`);

    const response = await fetch(templateUrl);
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

    const templateText = await response.text();

    // Crear un documento temporal y extraer los templates
    const parser = new DOMParser();
    const doc = parser.parseFromString(templateText, "text/html");
    const templates = doc.querySelectorAll("template");

    if (!templates.length) {
      console.warn(`⚠️ No se encontraron templates en ${templateUrl}.`);
      return;
    }

    templates.forEach(template => {
      const existingTemplate = document.body.querySelector(`#${template.id}`);

      if (!existingTemplate) {
        console.log(`✅ Insertando template #${template.id} en el DOM.`);
        document.body.appendChild(template.cloneNode(true));
      } else {
        console.warn(`⚠️ Template #${template.id} ya existe en el DOM.`);
      }
    });

  } catch (error) {
    console.error(`❌ Error al importar template desde ${templateUrl}:`, error);
  }
}
