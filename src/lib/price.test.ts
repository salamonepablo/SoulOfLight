import { describe, it, expect } from "vitest";
import { formatMoney, formatARS, formatUSD, formatEUR } from "./price";

describe("formatMoney", () => {
  it("debe formatear con valores por defecto (ARS)", () => {
    const result = formatMoney(1500);
    // ARS usa punto como separador de miles y coma para decimales
    expect(result).toContain("1.500");
    expect(result).toContain("$");
  });

  it("debe formatear con 2 decimales por defecto", () => {
    const result = formatMoney(99.9);
    expect(result).toContain("99,90");
  });

  it("debe respetar opciones de decimales personalizadas", () => {
    const result = formatMoney(100, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    expect(result).not.toContain(",00");
  });

  it("debe manejar valores negativos", () => {
    const result = formatMoney(-500);
    expect(result).toContain("500");
    expect(result).toMatch(/-|\(/); // Puede ser -$500 o ($500)
  });

  it("debe manejar cero correctamente", () => {
    const result = formatMoney(0);
    expect(result).toContain("0");
  });

  it("debe manejar números grandes", () => {
    const result = formatMoney(1000000);
    expect(result).toContain("1.000.000");
  });
});

describe("formatARS", () => {
  it("debe formatear en pesos argentinos", () => {
    const result = formatARS(2500);
    expect(result).toContain("$");
    expect(result).toContain("2.500");
  });
});

describe("formatUSD", () => {
  it("debe formatear en dólares estadounidenses", () => {
    const result = formatUSD(99.99);
    expect(result).toContain("$");
    expect(result).toContain("99.99");
  });
});

describe("formatEUR", () => {
  it("debe formatear en euros", () => {
    const result = formatEUR(150);
    expect(result).toContain("€");
    expect(result).toContain("150");
  });
});
