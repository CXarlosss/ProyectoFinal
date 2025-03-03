export function createButton(text, id, className = "") {
    const button = document.createElement("button");
    button.textContent = text;
    button.id = id;
    if (className) {
        button.classList.add(className);
    }
    return button;
}
