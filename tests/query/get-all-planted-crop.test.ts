import GetAllPlantedCrop from '../../src/app/query/get-all-planted-crop';
import Pg from '../../src/infra/repository/db/pg';

jest.mock('../../src/infra/repository/db/pg');

describe('GetAllPlantedCrop', () => {
  let pg: Pg;
  let getAllPlantedCrop: GetAllPlantedCrop;

  beforeEach(() => {
    pg = new Pg();
    getAllPlantedCrop = new GetAllPlantedCrop(pg);
  });

  it('should return an empty array when there are no planted crops', async () => {
    (pg.query as jest.Mock).mockResolvedValue({rows: []});

    const result = await getAllPlantedCrop.execute();

    expect(result).toEqual([]);
  });

  it('should return a list of planted crops', async () => {
    (pg.query as jest.Mock).mockResolvedValue({
      rows: [
        {
          id: 'crop1',
          crop_name: 'Crop 1',
          area_hectares: '10',
        },
        {
          id: 'crop2',
          crop_name: 'Crop 2',
          area_hectares: '20',
        },
      ],
    });

    const result = await getAllPlantedCrop.execute();

    expect(result).toEqual([
      {
        id: 'crop1',
        cropName: 'Crop 1',
        plantedAreaHectares: 10,
      },
      {
        id: 'crop2',
        cropName: 'Crop 2',
        plantedAreaHectares: 20,
      },
    ]);
  });
});
