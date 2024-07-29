import {DeletePlantedCropArea} from '../../src/app/usecase/delete-planted-crop-area';
import PlantedCropRepository from '../../src/domain/repository/PlantedCropRepository';
import FarmOwnerRepository from '../../src/domain/repository/FarmOwnerRepository';
import PlantedCropArea from '../../src/domain/entity/PlantedCrops';
import FarmOwner from '../../src/domain/entity/FarmOwner';

describe('DeletePlantedCropArea', () => {
  let plantedCropRepositoryMock: jest.Mocked<PlantedCropRepository>;
  let farmOwnerRepositoryMock: jest.Mocked<FarmOwnerRepository>;
  let deletePlantedCropAreaUseCase: DeletePlantedCropArea;
  let samplePlantedCropArea: PlantedCropArea;
  let sampleFarmOwner: FarmOwner;

  beforeEach(() => {
    plantedCropRepositoryMock = {
      findById: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<PlantedCropRepository>;

    farmOwnerRepositoryMock = {
      findById: jest.fn(),
      update: jest.fn(),
    } as unknown as jest.Mocked<FarmOwnerRepository>;

    deletePlantedCropAreaUseCase = new DeletePlantedCropArea(
      plantedCropRepositoryMock
    );

    samplePlantedCropArea = {
      _id: '1',
      _farmId: '1',
      _plantedAreaHectares: 10,
    } as PlantedCropArea;

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

  it('should delete the planted crop area successfully', async () => {
    const plantedCropAreaId = '1';
    plantedCropRepositoryMock.findById.mockResolvedValue(samplePlantedCropArea);
    farmOwnerRepositoryMock.findById.mockResolvedValue(sampleFarmOwner);
    plantedCropRepositoryMock.delete.mockResolvedValue(undefined);
    farmOwnerRepositoryMock.update.mockResolvedValue(sampleFarmOwner);

    await deletePlantedCropAreaUseCase.execute(plantedCropAreaId);

    expect(plantedCropRepositoryMock.findById).toHaveBeenCalledWith(
      plantedCropAreaId
    );
    expect(plantedCropRepositoryMock.delete).toHaveBeenCalledWith(
      plantedCropAreaId
    );
  });

  it('should throw an error if the planted crop area is not found', async () => {
    const plantedCropAreaId = '1';
    plantedCropRepositoryMock.findById.mockResolvedValue(undefined);

    await expect(
      deletePlantedCropAreaUseCase.execute(plantedCropAreaId)
    ).rejects.toThrow('Planted crop area not found');

    expect(farmOwnerRepositoryMock.findById).not.toHaveBeenCalled();
    expect(farmOwnerRepositoryMock.update).not.toHaveBeenCalled();
    expect(plantedCropRepositoryMock.delete).not.toHaveBeenCalled();
  });
});
