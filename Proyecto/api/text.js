import { mergeServicios } from "./__tests__/mergeServicios.test";

describe("mergeServicios", () => {
  it("debe combinar servicios y eliminar duplicados por ID", () => {
    const current = [
      { id: 1, nombre: "Servicio 1" },
      { id: 2, nombre: "Servicio 2" },
    ];
    const newData = [
      { id: 2, nombre: "Servicio 2" }, // Duplicado
      { id: 3, nombre: "Servicio 3" },
    ];

    const result = mergeServicios(current, newData);

    expect(result).toEqual([
      { id: 1, nombre: "Servicio 1" },
      { id: 2, nombre: "Servicio 2" },
      { id: 3, nombre: "Servicio 3" },
    ]);
  });
});