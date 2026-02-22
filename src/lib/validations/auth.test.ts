import { describe, it, expect } from "vitest";
import { registerSchema, loginSchema } from "./auth";

describe("registerSchema", () => {
  it("debe aceptar datos válidos", () => {
    const result = registerSchema.safeParse({
      name: "Juan Pérez",
      email: "juan@example.com",
      password: "Password123",
    });

    expect(result.success).toBe(true);
  });

  it("debe rechazar nombre muy corto", () => {
    const result = registerSchema.safeParse({
      name: "J",
      email: "juan@example.com",
      password: "Password123",
    });

    expect(result.success).toBe(false);
  });

  it("debe rechazar email inválido", () => {
    const result = registerSchema.safeParse({
      name: "Juan Pérez",
      email: "no-es-email",
      password: "Password123",
    });

    expect(result.success).toBe(false);
  });

  it("debe rechazar contraseña sin mayúscula", () => {
    const result = registerSchema.safeParse({
      name: "Juan Pérez",
      email: "juan@example.com",
      password: "password123",
    });

    expect(result.success).toBe(false);
  });

  it("debe rechazar contraseña sin minúscula", () => {
    const result = registerSchema.safeParse({
      name: "Juan Pérez",
      email: "juan@example.com",
      password: "PASSWORD123",
    });

    expect(result.success).toBe(false);
  });

  it("debe rechazar contraseña sin número", () => {
    const result = registerSchema.safeParse({
      name: "Juan Pérez",
      email: "juan@example.com",
      password: "PasswordABC",
    });

    expect(result.success).toBe(false);
  });

  it("debe rechazar contraseña muy corta", () => {
    const result = registerSchema.safeParse({
      name: "Juan Pérez",
      email: "juan@example.com",
      password: "Pass1",
    });

    expect(result.success).toBe(false);
  });

  it("no debe revelar qué campo específico falló en el mensaje", () => {
    const result = registerSchema.safeParse({
      name: "J",
      email: "invalid",
      password: "weak",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      // Todos los mensajes deben ser genéricos
      const messages = result.error.issues.map((e) => e.message);
      messages.forEach((msg) => {
        expect(msg).toBe("Verificá los datos ingresados");
      });
    }
  });
});

describe("loginSchema", () => {
  it("debe aceptar datos válidos", () => {
    const result = loginSchema.safeParse({
      email: "juan@example.com",
      password: "cualquier-cosa",
    });

    expect(result.success).toBe(true);
  });

  it("debe rechazar email inválido", () => {
    const result = loginSchema.safeParse({
      email: "no-es-email",
      password: "password",
    });

    expect(result.success).toBe(false);
  });

  it("debe rechazar contraseña vacía", () => {
    const result = loginSchema.safeParse({
      email: "juan@example.com",
      password: "",
    });

    expect(result.success).toBe(false);
  });
});
