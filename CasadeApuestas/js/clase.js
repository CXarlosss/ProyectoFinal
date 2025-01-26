class AuctionApp {
    constructor() {
        this.initEventListeners();
    }

    initEventListeners() {
        // Formulario de registro
        const form = document.querySelector("form");
        form?.addEventListener("submit", this.handleFormSubmit.bind(this));

        // Navegación del menú
        const links = document.querySelectorAll("nav ul li a");
        links.forEach(link => {
            link.addEventListener("click", this.handleMenuClick.bind(this));
        });

        // Interacción con tarjetas
        const cards = document.querySelectorAll(".card");
        cards.forEach(card => {
            card.addEventListener("mouseover", this.handleCardHover.bind(this, card));
            card.addEventListener("mouseout", this.handleCardOut.bind(this, card));
        });
    }

    handleFormSubmit(event) {
        event.preventDefault();
        const name = document.querySelector("#name")?.setAttribute("value","") || '';
        const email = document.querySelector("#email")?.setAttribute("value","") || '';

        if (name && email) {
            alert(`Gracias por registrarte, ${name}! Te hemos enviado un correo a ${email}.`);
            event.target.reset();
        } else {
            alert("Por favor, completa todos los campos.");
        }
    }

    handleMenuClick(event) {
        event.preventDefault();
        const targetId = event.target.getAttribute("href").substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: "smooth" });
        }
    }

    handleCardHover(card) {
        card.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.2)";
        card.style.transform = "scale(1.05)";
        card.style.transition = "transform 0.3s, box-shadow 0.3s";
    }

    handleCardOut(card) {
        card.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
        card.style.transform = "scale(1)";
    }
}

// Inicialización de la aplicación
document.addEventListener("DOMContentLoaded", () => {
    new AuctionApp();
});
