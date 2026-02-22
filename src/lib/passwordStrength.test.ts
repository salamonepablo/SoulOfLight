import { describe, expect, it } from "vitest";
import { getPasswordStrength } from "@/lib/passwordStrength";

describe("getPasswordStrength", () => {
  it("devuelve muy debil para string vacio", () => {
    const result = getPasswordStrength("");

    expect(result.score).toBe(0);
    expect(result.label).toBe("Muy debil");
  });

  it("detecta clave debil con solo letras minusculas", () => {
    const result = getPasswordStrength("password");

    expect(result.score).toBe(1);
    expect(result.label).toBe("Debil");
  });

  it("detecta clave media cuando combina mayusculas y numeros", () => {
    const result = getPasswordStrength("Password1");

    expect(result.score).toBe(3);
    expect(result.label).toBe("Media");
  });

  it("detecta clave fuerte cuando cumple todas las reglas", () => {
    const result = getPasswordStrength("Admin1234!");

    expect(result.score).toBe(4);
    expect(result.label).toBe("Fuerte");
  });
});
