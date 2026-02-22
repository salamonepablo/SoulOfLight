// Utilidades de formateo de precios multi-moneda.
// Se soportan distintas monedas y locales sin necesidad de cambiar código.
// Configuración por entorno:
// NEXT_PUBLIC_LOCALE=es-AR
// NEXT_PUBLIC_CURRENCY=ARS

const DEFAULT_LOCALE = process.env.NEXT_PUBLIC_LOCALE || "es-AR";
const DEFAULT_CURRENCY = process.env.NEXT_PUBLIC_CURRENCY || "ARS";

interface FormatMoneyOptions {
  locale?: string;
  currency?: string; // ISO 4217 e.g. 'ARS', 'USD', 'EUR'
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

export function formatMoney(
  value: number,
  {
    locale = DEFAULT_LOCALE,
    currency = DEFAULT_CURRENCY,
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  }: FormatMoneyOptions = {}
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);
}

// Wrappers específicos si se quiere forzar sin opciones extra.
export const formatARS = (value: number) =>
  formatMoney(value, { currency: "ARS", locale: "es-AR" });
export const formatUSD = (value: number) =>
  formatMoney(value, { currency: "USD", locale: "en-US" });
export const formatEUR = (value: number) =>
  formatMoney(value, { currency: "EUR", locale: "de-DE" });
