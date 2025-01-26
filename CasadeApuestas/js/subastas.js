document.addEventListener("DOMContentLoaded", () => {
    const auctionCards = document.querySelectorAll(".card");

    // Interacción con las tarjetas de subastas
    auctionCards.forEach(card => {
        card.addEventListener("mouseover", () => {
            const htmlCard = card;
            htmlCard.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.2)";
            htmlCard.style.transform = "scale(1.05)";
            htmlCard.style.transition = "transform 0.3s, box-shadow 0.3s";
        });

        card.addEventListener("mouseout", () => {
            const htmlCard = card;
            htmlCard.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
            htmlCard.style.transform = "scale(1)";
        });
    });

    console.log("Página de subastas cargada correctamente.");
});
