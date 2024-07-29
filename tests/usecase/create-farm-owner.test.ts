import CreateFarmOwner from '../../src/app/usecase/create-farm-owner';
import FarmOwner from '../../src/domain/entity/FarmOwner';
import FarmOwnerRepository from '../../src/domain/repository/FarmOwnerRepository';

describe('CreateFarmOwner', () => {
  it('should create a farm owner', async () => {
    const input = {
      name: 'Valid Name',
      registerNumber: '73347256000143',
      farm: {
        name: 'Valid Farm Name',
        totalFarmAreaHectares: 100,
        arableAreaHectares: 50,
        vegetationAreaHectares: 50,
      },
      address: {
        city: 'Valid City',
        state: 'VS',
      },
    };
    const farmOwnerRepositoryMock = {
      findByRegisterNumber: jest.fn(),
      save: jest.fn(),
    } as unknown as FarmOwnerRepository;

    jest
      .spyOn(farmOwnerRepositoryMock, 'findByRegisterNumber')
      .mockResolvedValue(undefined);
    jest
      .spyOn(farmOwnerRepositoryMock, 'save')
      .mockResolvedValue(
        FarmOwner.create(
          input.registerNumber,
          input.name,
          input.address,
          input.farm
        )
      );
    const useCase = new CreateFarmOwner(farmOwnerRepositoryMock);
    const output = await useCase.execute(input);
    expect(farmOwnerRepositoryMock.findByRegisterNumber).toHaveBeenCalledWith(
      input.registerNumber
    );
    expect(farmOwnerRepositoryMock.save).toHaveBeenCalledTimes(1);
    expect(output).toHaveProperty('id');
    expect(output.name).toBe(input.name);
    expect(output.registerNumber).toBe(input.registerNumber);
    expect(output.farm).toEqual(input.farm);
    expect(output.address).toEqual(input.address);
  });
  it('should be able to throw an error if farm owner already exists', async () => {
    const input = {
      name: 'Valid Name',
      registerNumber: '73347256000143',
      farm: {
        name: 'Valid Farm Name',
        totalFarmAreaHectares: 100,
        arableAreaHectares: 50,
        vegetationAreaHectares: 50,
      },
      address: {
        city: 'Valid City',
        state: 'VS',
      },
    };
    const farmOwnerRepositoryMock = {
      findByRegisterNumber: jest.fn(),
      save: jest.fn(),
    } as unknown as FarmOwnerRepository;

    jest
      .spyOn(farmOwnerRepositoryMock, 'findByRegisterNumber')
      .mockResolvedValue(
        FarmOwner.create(
          input.registerNumber,
          input.name,
          input.address,
          input.farm
        )
      );
    const saveSpy = jest.spyOn(farmOwnerRepositoryMock, 'save');
    const useCase = new CreateFarmOwner(farmOwnerRepositoryMock);
    await expect(useCase.execute(input)).rejects.toThrow(
      'Farm owner already exists with given register number'
    );
    expect(saveSpy).not.toHaveBeenCalled();
  });
});
