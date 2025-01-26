import store from "../class/redux.js";
import { registerUser, addAuction } from "../class/redux.js";
document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll("nav ul li a");

    // Navegación suave
    links.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = link?.getAttribute("href")?.substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: "smooth" });
            }
        });
    });

    console.log("Página principal cargada correctamente.");
});

