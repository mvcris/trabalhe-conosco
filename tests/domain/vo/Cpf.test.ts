import {Cpf} from '../../../src/domain/entity/vo/Cpf';

describe('Cpf Validation Tests', () => {
  it('should create a Cpf instance with a valid CPF', () => {
    const validCpf = '255.539.940-20';
    const cpf = new Cpf(validCpf);
    expect(cpf.getValue()).toBe(validCpf);
  });

  it('should throw an error for a CPF with incorrect length', () => {
    expect(() => {
      new Cpf('123.456.789');
    }).toThrow('Invalid CPF');
  });

  it('should throw an error for a CPF with all same digits', () => {
    expect(() => {
      new Cpf('111.111.151-11');
    }).toThrow('Invalid CPF');
  });

  it('should throw an error for a CPF with invalid checksum', () => {
    expect(() => {
      new Cpf('123.456.789-00');
    }).toThrow('Invalid CPF');
  });

  it('should throw an error for an empty CPF', () => {
    expect(() => {
      new Cpf('');
    }).toThrow('Invalid CPF');
  });

  it('should throw an error for a CPF with non-numeric characters', () => {
    expect(() => {
      new Cpf('123.abc.789-09');
    }).toThrow('Invalid CPF');
  });
});
