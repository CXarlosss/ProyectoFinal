export function createForm() {
    const form = document.createElement("form");
    form.id = "myForm";

    const input = document.createElement("input");
    input.type = "text";
    input.id = "username";
    input.name = "username";

    const button = document.createElement("button");
    button.type = "submit";
    button.textContent = "Enviar";

    form.appendChild(input);
    form.appendChild(button);

    return form;
}
