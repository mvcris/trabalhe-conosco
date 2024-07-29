import {DeleteFarmOwner} from '../../src/app/usecase/delete-farm-owner';
import FarmOwner from '../../src/domain/entity/FarmOwner';
import FarmOwnerRepository from '../../src/domain/repository/FarmOwnerRepository';

describe('DeleteFarmOwner', () => {
  let farmOwnerRepositoryMock: jest.Mocked<FarmOwnerRepository>;
  let deleteFarmOwnerUseCase: DeleteFarmOwner;
  let sampleFarmOwner: FarmOwner;

  beforeEach(() => {
    farmOwnerRepositoryMock = {
      findById: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<FarmOwnerRepository>;
    deleteFarmOwnerUseCase = new DeleteFarmOwner(farmOwnerRepositoryMock);
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

  it('should delete the farm owner successfully', async () => {
    const farmOwnerId = '1';
    farmOwnerRepositoryMock.findById.mockResolvedValue(sampleFarmOwner);
    farmOwnerRepositoryMock.delete.mockResolvedValue(undefined);

    await deleteFarmOwnerUseCase.execute(farmOwnerId);

    expect(farmOwnerRepositoryMock.findById).toHaveBeenCalledWith(farmOwnerId);
    expect(farmOwnerRepositoryMock.delete).toHaveBeenCalledWith(farmOwnerId);
  });

  it('should throw an error if the farm owner is not found', async () => {
    const farmOwnerId = '1';
    farmOwnerRepositoryMock.findById.mockResolvedValue(undefined);

    await expect(deleteFarmOwnerUseCase.execute(farmOwnerId)).rejects.toThrow(
      'Farm owner not found'
    );

    expect(farmOwnerRepositoryMock.delete).not.toHaveBeenCalled();
  });
});
