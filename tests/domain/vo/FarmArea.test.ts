import FarmArea from '../../../src/domain/entity/vo/FarmArea';

describe('FarmArea Additional Tests', () => {
  it('should create a FarmArea instance with valid parameters', () => {
    const farmArea = new FarmArea('Farm 6', 150, 90, 60);
    expect(farmArea._name).toBe('Farm 6');
    expect(farmArea._totalFarmAreaHectares).toBe(150);
    expect(farmArea._arableAreaHectares).toBe(90);
    expect(farmArea._vegetationAreaHectares).toBe(60);
  });

  it('should throw an error if the arable area is greater than the total farm area', () => {
    expect(() => {
      new FarmArea('Farm 7', 100, 110, 20);
    }).toThrow(
      'The sum of arable area and vegetation area must be less than or equal to the total farm area'
    );
  });

  it('should throw an error if the arable area is negative', () => {
    expect(() => {
      new FarmArea('Farm 9', 100, -10, 40);
    }).toThrow('The arable area must be greater than zero');
  });

  it('should throw an error if the vegetation area is negative', () => {
    expect(() => {
      new FarmArea('Farm 10', 100, 60, -20);
    }).toThrow('The vegetation area must be greater than zero');
  });

  it('should correctly retrieve properties using getters', () => {
    const farmArea = new FarmArea('Farm 11', 300, 180, 120);
    expect(farmArea._name).toBe('Farm 11');
    expect(farmArea._totalFarmAreaHectares).toBe(300);
    expect(farmArea._arableAreaHectares).toBe(180);
    expect(farmArea._vegetationAreaHectares).toBe(120);
  });
});
