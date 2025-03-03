// @ts-check

document.addEventListener("DOMContentLoaded", () => {
    /** @type {NodeListOf<HTMLElement>} */
    const elementosOcultos = document.querySelectorAll(".scroll-hidden");

    /**
     * 📌 Verifica si un elemento está en el viewport.
     * @param {HTMLElement} elemento - Elemento a verificar
     * @returns {boolean} - True si está en la pantalla, False si no
     */
    function elementoEnPantalla(elemento) {
        const rect = elemento.getBoundingClientRect();
        console.log("📏 Posición del elemento:", rect);
        
        return (
            rect.top < window.innerHeight * 0.85 && rect.bottom > 0
        );
    }
    

    /**
     * 📌 Muestra los elementos con animación cuando entran en el viewport.
     */
    function mostrarElementos() {
        elementosOcultos.forEach((elemento) => {
            console.log("🔍 Verificando elemento:", elemento);
    
            if (elementoEnPantalla(elemento) && !elemento.classList.contains("scroll-visible")) {
                console.log("✅ Elemento visible, aplicando animación:", elemento);
    
                elemento.classList.add("scroll-visible");
                elemento.classList.remove("scroll-hidden");
    
                // 👇 Forzar reflujo para reiniciar la animación
                void elemento.offsetWidth;
            } else {
                console.log("❌ Aún no está en pantalla:", elemento);
            }
        });
    }
    
    
    
    // Ejecutar manualmente para probar si se activan las clases
    window.addEventListener("scroll", mostrarElementos);
    window.addEventListener("load", mostrarElementos);
    mostrarElementos();
}
);