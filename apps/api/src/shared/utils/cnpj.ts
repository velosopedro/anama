export function normalizeCnpj(cnpj: string) {
  return cnpj.replace(/\D/g, "");
}

function calculateDigit(base: string, weights: number[]) {
  const sum = base.split("").reduce((total, digit, index) => {
    return total + Number(digit) * weights[index]!;
  }, 0);

  const remainder = sum % 11;

  return remainder < 2 ? 0 : 11 - remainder;
}

export function isValidCnpj(cnpj: string) {
  const normalized = normalizeCnpj(cnpj);

  if (normalized.length !== 14) {
    return false;
  }

  if (/^(\d)\1+$/.test(normalized)) {
    return false;
  }

  const base = normalized.slice(0, 12);

  const firstDigit = calculateDigit(base, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);

  const secondDigit = calculateDigit(
    `${base}${firstDigit}`,
    [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
  );

  return normalized === `${base}${firstDigit}${secondDigit}`;
}

export function formatCnpj(cnpj: string) {
  const normalized = normalizeCnpj(cnpj);

  return normalized.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    "$1.$2.$3/$4-$5",
  );
}
