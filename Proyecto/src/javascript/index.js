// @ts-check

/* ========================== Carrusel de Testimonios=========================== */
//Detectamos los elementos necesarios en el DOM
//Se generan indicadores para cada testimonio
//Se agregan eventos para que cuando se le haga click en el boton de siguiente o anterior se mueva el carrusel
//Se configura un autoplay para que el carrusel se mueva automaticamente cada 7 segundos
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
        indicator.classList.add("testimonial-dot");
        indicator.dataset.index = i.toString();
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
        if (!sliderTestimonios) return;
        sliderTestimonios.style.transform = `translateX(-${indexTestimonios * 100}%)`;
        updateIndicatorsTestimonios();
    }

    nextBtnTestimonios.addEventListener("click", () => {
        indexTestimonios = (indexTestimonios + 1) % totalSlidesTestimonios;
        moveSlideTestimonios();
        resetAutoSlideTestimonios();
    });

    prevBtnTestimonios.addEventListener("click", () => {
        indexTestimonios = (indexTestimonios - 1 + totalSlidesTestimonios) % totalSlidesTestimonios;
        moveSlideTestimonios();
        resetAutoSlideTestimonios();
    });

    indicatorsTestimonios.forEach((dot) => {
        dot.addEventListener("click", () => {
            const index = parseInt(dot.dataset.index || "0", 10);
            if (!isNaN(index)) {
                indexTestimonios = index;
                moveSlideTestimonios();
                resetAutoSlideTestimonios();
            }
        });
    });

    let autoSlideTestimonios = setInterval(() => {
        indexTestimonios = (indexTestimonios + 1) % totalSlidesTestimonios;
        moveSlideTestimonios();
    }, 7000);

    function resetAutoSlideTestimonios() {
        clearInterval(autoSlideTestimonios);
        autoSlideTestimonios = setInterval(() => {
            indexTestimonios = (indexTestimonios + 1) % totalSlidesTestimonios;
            moveSlideTestimonios();
        }, 7000);
    }
});

/* ========================== Carrusel de Chats Destacados=========================== */
//Muestras los negocios destacados en un carrusel
//Se generan eventos para que cuando se le haga click en el boton de siguiente o anterior se mueva el carrusel
//Se configura un autoplay para que el carrusel se mueva automaticamente cada 7 segundos

document.addEventListener("DOMContentLoaded", () => {
    const sliderNegocios = /** @type {HTMLElement | null} */ (document.querySelector(".business-slider"));
    const prevBtnNegocios = /** @type {HTMLButtonElement | null} */ (document.querySelector(".carousel-btn.prev"));
    const nextBtnNegocios = /** @type {HTMLButtonElement | null} */ (document.querySelector(".carousel-btn.next"));

    if (!sliderNegocios || !prevBtnNegocios || !nextBtnNegocios) {
        console.error("❌ Error: No se encontraron elementos del carrusel de negocios.");
        return;
    }

    const negocioItems = /** @type {NodeListOf<HTMLElement>} */ (document.querySelectorAll(".business-card"));
    const totalSlidesNegocios = negocioItems.length;
    let indexNegocios = 0;

    function moveSlideNegocios() {
        if (!sliderNegocios) return;
        const cardWidth = negocioItems[0]?.offsetWidth || 300;
        sliderNegocios.style.transform = `translateX(-${indexNegocios * cardWidth}px)`;
    }

    nextBtnNegocios.addEventListener("click", () => {
        indexNegocios = (indexNegocios + 1) % totalSlidesNegocios;
        moveSlideNegocios();
        resetAutoSlideNegocios();
    });

    prevBtnNegocios.addEventListener("click", () => {
        indexNegocios = (indexNegocios - 1 + totalSlidesNegocios) % totalSlidesNegocios;
        moveSlideNegocios();
        resetAutoSlideNegocios();
    });

    let autoSlideNegocios = setInterval(() => {
        indexNegocios = (indexNegocios + 1) % totalSlidesNegocios;
        moveSlideNegocios();
    }, 7000);

    function resetAutoSlideNegocios() {
        clearInterval(autoSlideNegocios);
        autoSlideNegocios = setInterval(() => {
            indexNegocios = (indexNegocios + 1) % totalSlidesNegocios;
            moveSlideNegocios();
        }, 7000);
    }
});
