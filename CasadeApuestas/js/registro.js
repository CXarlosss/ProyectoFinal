document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

    // Gestión del formulario de registro
    form?.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.querySelector("#nombre")?.setAttribute("value","") || '';
        const email = document.querySelector("#email")?.setAttribute("value","") || '';

        if (name && email) {
            alert(`Gracias por registrarte, ${name}! Hemos enviado un correo de confirmación a ${email}.`);
            form?.reset();
        } else {
            alert("Por favor, completa todos los campos.");
        }
    });

    console.log("Página de registro cargada correctamente.");
});
