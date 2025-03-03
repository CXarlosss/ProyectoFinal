// @ts-check

// @ts-check


/* ==========================
  Carrusel de Testimonios
=========================== */
document.addEventListener("DOMContentLoaded", () => {
    const sliderTestimonios = /** @type {HTMLElement | null} */ (document.querySelector(".testimonial-slider"));
    const prevBtnTestimonios = /** @type {HTMLButtonElement | null} */ (document.querySelector(".prev-testimonial"));
    const nextBtnTestimonios = /** @type {HTMLButtonElement | null} */ (document.querySelector(".next-testimonial"));
    const indicatorsContainer = /** @type {HTMLElement | null} */ (document.querySelector(".testimonial-indicators"));

    if (!sliderTestimonios || !prevBtnTestimonios || !nextBtnTestimonios || !indicatorsContainer) {
        console.error("❌ Error: No se encontraron elementos del carrusel de testimonios.");
        return;
    }

    const testimonialItems = /** @type {NodeListOf<HTMLElement>} */ (document.querySelectorAll(".testimonial-item"));
    const totalSlidesTestimonios = testimonialItems.length;

    let indexTestimonios = 0;

    // Crear indicadores dinámicos
    for (let i = 0; i < totalSlidesTestimonios; i++) {
        const indicator = document.createElement("div");
        if (i === 0) indicator.classList.add("active");
        indicatorsContainer.appendChild(indicator);
    }

    const indicatorsTestimonios = /** @type {NodeListOf<HTMLElement>} */ (document.querySelectorAll(".testimonial-indicators div"));

    function updateIndicatorsTestimonios() {
        indicatorsTestimonios.forEach((dot, i) => {
            dot.classList.toggle("active", i === indexTestimonios);
        });
    }

    function moveSlideTestimonios() {
        const sliderTestimonios = /** @type {HTMLElement | null} */ (document.querySelector(".testimonial-slider"));
    
        if (!sliderTestimonios) {
            console.error("❌ Error: No se encontró el contenedor .testimonial-slider en el DOM.");
            return;
        }
    
        sliderTestimonios.style.transform = `translateX(-${indexTestimonios * 100}vw)`; // Utilizar vw para que se ajuste al ancho de la pantalla
        updateIndicatorsTestimonios();
    }

    moveSlideTestimonios();    

    nextBtnTestimonios.addEventListener("click", () => {
        indexTestimonios = (indexTestimonios + 1) % totalSlidesTestimonios;
        moveSlideTestimonios();
    });

    prevBtnTestimonios.addEventListener("click", () => {
        indexTestimonios = (indexTestimonios - 1 + totalSlidesTestimonios) % totalSlidesTestimonios;
        moveSlideTestimonios();
    });

    indicatorsTestimonios.forEach((dot, i) => {
        dot.addEventListener("click", () => {
            indexTestimonios = i;
            moveSlideTestimonios();
        });
    });

    // ⏳ Auto desplazamiento de testimonios cada 7 segundos
    setInterval(() => {
        indexTestimonios = (indexTestimonios + 1) % totalSlidesTestimonios;
        moveSlideTestimonios();
    }, 7000);
});
