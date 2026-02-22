import { describe, expect, it } from "vitest";
import { canManageUsers, canUpdateUserStatus, isUserAllowedToLogin } from "./userAccess";

describe("isUserAllowedToLogin", () => {
  it("permite login cuando usuario esta activo", () => {
    expect(isUserAllowedToLogin(true)).toBe(true);
  });

  it("bloquea login cuando usuario esta inactivo", () => {
    expect(isUserAllowedToLogin(false)).toBe(false);
  });
});

describe("canManageUsers", () => {
  it("permite gestion cuando el rol es ADMIN", () => {
    expect(canManageUsers("ADMIN")).toBe(true);
  });

  it("deniega gestion para rol CUSTOMER", () => {
    expect(canManageUsers("CUSTOMER")).toBe(false);
  });

  it("deniega gestion si rol no existe", () => {
    expect(canManageUsers(undefined)).toBe(false);
  });
});

describe("canUpdateUserStatus", () => {
  it("impide darse de baja a si mismo", () => {
    expect(canUpdateUserStatus("u1", "u1", false)).toBe(false);
  });

  it("permite reactivar al mismo usuario", () => {
    expect(canUpdateUserStatus("u1", "u1", true)).toBe(true);
  });

  it("permite actualizar estado de otros usuarios", () => {
    expect(canUpdateUserStatus("admin", "u2", false)).toBe(true);
  });
});
