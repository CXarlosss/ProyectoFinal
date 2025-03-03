/* eslint-disable no-undef */
import { createButton } from "./VerificarButton.js";


// @ts-ignore
test("Debe crear un botón con la clase especificada", () => {
    const button = createButton("Enviar", "btn2", "btn-primary");


    // @ts-ignore
    expect(button.classList.contains("btn-primary")).toBe(true);
});
