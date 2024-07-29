import Cnpj from '../../../src/domain/entity/vo/Cnpj';

describe('Cnpj', () => {
  it('should initialize correctly with a valid CNPJ', () => {
    expect(() => new Cnpj('73.347.256/0001-43')).not.toThrow();
  });

  it('should throw an error with an invalid CNPJ length', () => {
    expect(() => new Cnpj('123456789012')).toThrow('CNPJ must have 14 digits');
  });

  it('should throw an error with an invalid CNPJ (repeated digits)', () => {
    expect(() => new Cnpj('11111111111111')).toThrow('Invalid CNPJ');
  });

  it('should throw an error with an invalid CNPJ (incorrect digits)', () => {
    expect(() => new Cnpj('12345678901234')).toThrow('Invalid CNPJ');
  });

  it('should validate a correct CNPJ', () => {
    const validCnpj = '34629568000198';
    expect(() => new Cnpj(validCnpj)).not.toThrow();
  });

  it('should invalidate a CNPJ with incorrect first digit', () => {
    const invalidCnpj = '12345678000194';
    expect(() => new Cnpj(invalidCnpj)).toThrow('Invalid CNPJ');
  });

  it('should invalidate a CNPJ with incorrect second digit', () => {
    const invalidCnpj = '12345678000196';
    expect(() => new Cnpj(invalidCnpj)).toThrow('Invalid CNPJ');
  });

  it('should return the correct CNPJ value', () => {
    const cnpj = '34629568000198';
    const instance = new Cnpj(cnpj);
    expect(instance.getValue()).toBe(cnpj);
  });
});
