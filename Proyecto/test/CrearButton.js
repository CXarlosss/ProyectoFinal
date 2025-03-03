export function createButton(text, id) {
    const button = document.createElement("button");
    button.textContent = text;
    button.id = id;
    return button;
}
