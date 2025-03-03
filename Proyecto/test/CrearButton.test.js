/* eslint-disable no-undef */
import { createButton } from "./CrearButton.js";

// @ts-ignore
test("Debe crear un botón con el texto y el id correctos", () => {
    const button = createButton("Haz clic", "btn1");

    // @ts-ignore
    expect(button).toBeInstanceOf(HTMLButtonElement);
    // @ts-ignore
    expect(button.textContent).toBe("Haz clic");
    // @ts-ignore
    expect(button.id).toBe("btn1");
});
