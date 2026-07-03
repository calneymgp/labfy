const VALID_DDDS = new Set([
  11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32, 33, 34, 35, 37, 38, 41, 42, 43,
  44, 45, 46, 47, 48, 49, 51, 53, 54, 55, 61, 62, 63, 64, 65, 66, 67, 68, 69, 71, 73, 74, 75, 77,
  79, 81, 82, 83, 84, 85, 86, 87, 88, 89, 91, 92, 93, 94, 95, 96, 97, 98, 99,
]);

export type PhoneInput = {
  ddi: string;
  ddd: string;
  number: string;
};

export function validatePhone({ ddi, ddd, number }: PhoneInput): string | null {
  const cleanDdi = ddi.replace(/\D/g, "");
  const cleanDdd = ddd.replace(/\D/g, "");
  const cleanNumber = number.replace(/\D/g, "");

  if (!cleanDdi) return "Informe o DDI.";

  if (cleanDdi === "55") {
    if (!/^\d{2}$/.test(cleanDdd) || !VALID_DDDS.has(Number(cleanDdd))) {
      return "DDD inválido.";
    }
    if (!/^9\d{8}$/.test(cleanNumber)) {
      return "Número de celular inválido — use os 9 dígitos, começando com 9.";
    }
  } else {
    if (!/^\d{6,13}$/.test(cleanNumber)) {
      return "Número de celular inválido.";
    }
  }

  return null;
}

export function formatPhoneE164({ ddi, ddd, number }: PhoneInput): string {
  const cleanDdi = ddi.replace(/\D/g, "");
  const cleanDdd = ddd.replace(/\D/g, "");
  const cleanNumber = number.replace(/\D/g, "");
  return `+${cleanDdi}${cleanDdd}${cleanNumber}`;
}
