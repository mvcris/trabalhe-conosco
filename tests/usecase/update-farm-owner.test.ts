import PlantedCropRepository from '../../src/domain/repository/PlantedCropRepository';
import PlantedCrop from '../../src/domain/entity/PlantedCrops';
import FarmOwner from '../../src/domain/entity/FarmOwner';
import FarmOwnerRepository from '../../src/domain/repository/FarmOwnerRepository';
import UpdateFarmOwner from '../../src/app/usecase/update-farm-owner';

describe('UpdateFarmOwner', () => {
  let farmOwnerRepositoryMock: jest.Mocked<FarmOwnerRepository>;
  let plantedCropRepositoryMock: jest.Mocked<PlantedCropRepository>;
  let updateFarmOwnerUseCase: UpdateFarmOwner;
  let sampleFarmOwner: FarmOwner;

  beforeEach(() => {
    farmOwnerRepositoryMock = {
      findById: jest.fn(),
      findByRegisterNumber: jest.fn(),
      update: jest.fn(),
    } as unknown as jest.Mocked<FarmOwnerRepository>;

    plantedCropRepositoryMock = {
      findByFarmId: jest.fn(),
    } as unknown as jest.Mocked<PlantedCropRepository>;

    updateFarmOwnerUseCase = new UpdateFarmOwner(
      farmOwnerRepositoryMock,
      plantedCropRepositoryMock
    );

    sampleFarmOwner = FarmOwner.restore(
      '1',
      '73347256000143',
      'Valid Name',
      {city: 'Valid City', state: 'VS'},
      {
        name: 'Valid Farm Name',
        totalFarmAreaHectares: 100,
        arableAreaHectares: 50,
        vegetationAreaHectares: 50,
      }
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not update if no fields are provided', async () => {
    const input = {id: '1'};
    farmOwnerRepositoryMock.findById.mockResolvedValue(sampleFarmOwner);
    await updateFarmOwnerUseCase.execute(input);
    expect(farmOwnerRepositoryMock.update).not.toHaveBeenCalled();
  });

  it('should throw an error if the farm owner is not found', async () => {
    const input = {id: '1', name: 'Updated Name'};
    farmOwnerRepositoryMock.findById.mockResolvedValue(undefined);
    await expect(updateFarmOwnerUseCase.execute(input)).rejects.toThrow(
      'Farm owner not found'
    );
    expect(farmOwnerRepositoryMock.update).not.toHaveBeenCalled();
  });

  it('should throw an error if the register number already exists', async () => {
    const input = {id: '1', registerNumber: '12345678901234'};
    farmOwnerRepositoryMock.findById.mockResolvedValue(sampleFarmOwner);
    farmOwnerRepositoryMock.findByRegisterNumber.mockResolvedValue(
      sampleFarmOwner
    );
    await expect(updateFarmOwnerUseCase.execute(input)).rejects.toThrow(
      'Farm owner already exists with given register number'
    );
    expect(farmOwnerRepositoryMock.update).not.toHaveBeenCalled();
  });

  it('should throw an error if the arable area is less than the total planted area', async () => {
    const input = {id: '1', farm: {arableAreaHectares: 30}};
    const plantedCrops = [
      PlantedCrop.restore('1', '1', 'Algodão', 20),
      PlantedCrop.restore('2', '1', 'Café', 15),
    ];
    farmOwnerRepositoryMock.findById.mockResolvedValue(sampleFarmOwner);
    plantedCropRepositoryMock.findByFarmId.mockResolvedValue(plantedCrops);
    await expect(updateFarmOwnerUseCase.execute(input)).rejects.toThrow(
      'Arable area is less than total planted area'
    );
    expect(farmOwnerRepositoryMock.update).not.toHaveBeenCalled();
  });

  it('should update the farm owner successfully', async () => {
    const input = {
      id: '1',
      name: 'Updated Name',
      address: {city: 'Updated City', state: 'VS'},
      farm: {
        arableAreaHectares: 100,
        totalFarmAreaHectares: 150,
        vegetationAreaHectares: 10,
      },
    };
    const useCase = new UpdateFarmOwner(
      farmOwnerRepositoryMock,
      plantedCropRepositoryMock
    );
    farmOwnerRepositoryMock.findById.mockResolvedValue(sampleFarmOwner);
    plantedCropRepositoryMock.findByFarmId.mockResolvedValue([]);
    await useCase.execute(input);
    expect(farmOwnerRepositoryMock.findById).toHaveBeenCalledWith(input.id);
  });
});
