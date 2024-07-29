export default class Cnpj {
  constructor(private value: string) {
    Cnpj.validate(this.value);
  }

  static validate(cnpj: string): void {
    cnpj = cnpj.replace(/[^\d]/g, '');
    if (cnpj.length !== 14) {
      throw new Error('CNPJ must have 14 digits.');
    }
    if (/^(\d)\1{13}$/.test(cnpj)) {
      throw new Error('Invalid CNPJ');
    }
    if (!Cnpj.validateDigit(cnpj, 1)) {
      throw new Error('Invalid CNPJ');
    }
    if (!Cnpj.validateDigit(cnpj, 2)) {
      throw new Error('Invalid CNPJ');
    }
  }

  private static validateDigit(cnpj: string, digit: number): boolean {
    const length = digit === 1 ? 12 : 13;
    const weight =
      digit === 1
        ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
        : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const baseCNPJ = cnpj.substring(0, length);
    const verifier = parseInt(cnpj.charAt(length), 10);

    const sum = baseCNPJ
      .split('')
      .map((num, i) => parseInt(num, 10) * weight[i])
      .reduce((acc, val) => acc + val, 0);

    const mod = sum % 11;
    const checkDigit = mod < 2 ? 0 : 11 - mod;

    return checkDigit === verifier;
  }

  getValue() {
    return this.value;
  }
}
