/* eslint-disable no-undef */
// @ts-nocheck
import { createForm } from "./Form.js";


test("Debe crear un formulario con un input y un botón de envío", () => {
    const form = createForm();

    expect(form).toBeInstanceOf(HTMLFormElement);
    expect(form.querySelector("input")).not.toBeNull();
    expect(form.querySelector("button")).not.toBeNull();
    expect(form.querySelector("input").id).toBe("username");
    expect(form.querySelector("button").textContent).toBe("Enviar");
});
