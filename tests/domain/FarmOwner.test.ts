import FarmOwner from '../../src/domain/entity/FarmOwner';
import {Cpf} from '../../src/domain/entity/vo/Cpf';

describe('FarmOwner', () => {
  describe('create', () => {
    it('should create a FarmOwner with a valid CNPJ', () => {
      const farmOwner = FarmOwner.create(
        '73.347.256/0001-43',
        'Farm Owner Name',
        {city: 'City', state: 'State'},
        {
          name: 'Farm Name',
          totalFarmAreaHectares: 100,
          arableAreaHectares: 60,
          vegetationAreaHectares: 40,
        }
      );
      expect(farmOwner).toBeInstanceOf(FarmOwner);
    });

    it('should create a FarmOwner with a valid CPF', () => {
      const farmOwner = FarmOwner.create(
        '62395492078',
        'Farm Owner Name',
        {city: 'City', state: 'State'},
        {
          name: 'Farm Name',
          totalFarmAreaHectares: 100,
          arableAreaHectares: 60,
          vegetationAreaHectares: 40,
        }
      );
      expect(farmOwner).toBeInstanceOf(FarmOwner);
    });

    it('should throw an error with an invalid register number', () => {
      expect(() =>
        FarmOwner.create(
          'invalid',
          'Farm Owner Name',
          {city: 'City', state: 'State'},
          {
            name: 'Farm Name',
            totalFarmAreaHectares: 100,
            arableAreaHectares: 60,
            vegetationAreaHectares: 40,
          }
        )
      ).toThrow();
    });
  });

  describe('restore', () => {
    it('should restore a FarmOwner with a valid CNPJ', () => {
      const farmOwner = FarmOwner.restore(
        'some-uuid',
        '73.347.256/0001-43',
        'Farm Owner Name',
        {city: 'City', state: 'State'},
        {
          name: 'Farm Name',
          totalFarmAreaHectares: 100,
          arableAreaHectares: 60,
          vegetationAreaHectares: 40,
        }
      );
      expect(farmOwner).toBeInstanceOf(FarmOwner);
    });

    it('should restore a FarmOwner with a valid CPF', () => {
      const farmOwner = FarmOwner.restore(
        'some-uuid',
        '62395492078',
        'Farm Owner Name',
        {city: 'City', state: 'State'},
        {
          name: 'Farm Name',
          totalFarmAreaHectares: 100,
          arableAreaHectares: 60,
          vegetationAreaHectares: 40,
        }
      );
      expect(farmOwner).toBeInstanceOf(FarmOwner);
    });
  });

  describe('checkIfIsCpfOrCnpj', () => {
    it('should return a Cpf instance for a valid CPF', () => {
      const result = FarmOwner.checkIfIsCpfOrCnpj('62395492078');
      expect(result).toBeInstanceOf(Cpf);
    });

    it('should throw an error for an invalid register number', () => {
      expect(() => FarmOwner.checkIfIsCpfOrCnpj('invalid')).toThrow();
    });
  });

  describe('getters', () => {
    it('should return the correct id', () => {
      const farmOwner = FarmOwner.restore(
        'some-uuid',
        '73.347.256/0001-43',
        'Farm Owner Name',
        {city: 'City', state: 'State'},
        {
          name: 'Farm Name',
          totalFarmAreaHectares: 100,
          arableAreaHectares: 60,
          vegetationAreaHectares: 40,
        }
      );
      expect(farmOwner._id).toBe('some-uuid');
    });
  });
});
