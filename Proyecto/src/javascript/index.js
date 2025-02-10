document.addEventListener("DOMContentLoaded", () => {
    /* ==========================
      Carrusel de Servicios 
    =========================== */
    const sliderServicios = document.querySelector(".business-slider");
    const prevBtnServicios = document.querySelector(".prev");
    const nextBtnServicios = document.querySelector(".next");

    let indexServicios = 0;
    let cardWidthServicios;
    let totalCardsServicios;
    let visibleCardsServicios;

    setTimeout(() => {
        const businessCards = document.querySelectorAll(".business-card");

        if (businessCards.length === 0) return; // Evita errores si no hay tarjetas

        const cardStyles = window.getComputedStyle(businessCards[0]);
        const cardMargin = parseFloat(cardStyles.marginRight) + parseFloat(cardStyles.marginLeft);
        cardWidthServicios = businessCards[0].offsetWidth + cardMargin;

        totalCardsServicios = businessCards.length;
        visibleCardsServicios = Math.floor(sliderServicios.offsetWidth / cardWidthServicios);

        nextBtnServicios.addEventListener("click", () => {
            if (indexServicios < totalCardsServicios - visibleCardsServicios) {
                indexServicios++;
                sliderServicios.style.transform = `translateX(-${indexServicios * cardWidthServicios}px)`;
            }
        });

        prevBtnServicios.addEventListener("click", () => {
            if (indexServicios > 0) {
                indexServicios--;
                sliderServicios.style.transform = `translateX(-${indexServicios * cardWidthServicios}px)`;
            }
        });
    }, 300); // Pequeño retraso para que cargue correctamente
});

    
    /* ==========================
      Carrusel de Testimonios
    =========================== */
    const sliderTestimonios = document.querySelector(".testimonial-slider");
    const prevBtnTestimonios = document.querySelector(".prev-testimonial");
    const nextBtnTestimonios = document.querySelector(".next-testimonial");
    const indicatorsContainer = document.querySelector(".testimonial-indicators");

    let indexTestimonios = 0;
    const totalSlidesTestimonios = document.querySelectorAll(".testimonial-item").length;

    // Crear indicadores dinámicos
    for (let i = 0; i < totalSlidesTestimonios; i++) {
        const indicator = document.createElement("div");
        if (i === 0) indicator.classList.add("active");
        indicatorsContainer.appendChild(indicator);
    }

    const indicatorsTestimonios = document.querySelectorAll(".testimonial-indicators div");

    function updateIndicatorsTestimonios() {
        indicatorsTestimonios.forEach((dot, i) => {
            dot.classList.toggle("active", i === indexTestimonios);
        });
    }

    function moveSlideTestimonios() {
        sliderTestimonios.style.transform = `translateX(-${indexTestimonios * 100}%)`;
        updateIndicatorsTestimonios();
    }

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

    // ⏳ Auto desplazamiento de testimonios cada 5 segundos
    setInterval(() => {
        indexTestimonios = (indexTestimonios + 1) % totalSlidesTestimonios;
        moveSlideTestimonios();
    }, 7000);
