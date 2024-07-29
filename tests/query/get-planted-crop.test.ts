import GetPlantedCrop from '../../src/app/query/get-planted-crop';
import Pg from '../../src/infra/repository/db/pg';

describe('GetPlantedCrop', () => {
  let pg: Pg;
  let getPlantedCrop: GetPlantedCrop;

  beforeEach(() => {
    pg = {
      query: jest.fn(),
    } as unknown as Pg;
    getPlantedCrop = new GetPlantedCrop(pg);
  });

  it('should return an empty object when no rows are returned', async () => {
    (pg.query as jest.Mock).mockResolvedValue({rows: []});

    const result = await getPlantedCrop.execute('some-crop-id');

    expect(result).toEqual({});
  });

  it('should return planted crop details when a row is returned', async () => {
    (pg.query as jest.Mock).mockResolvedValue({
      rows: [
        {
          id: '1',
          crop_name: 'Wheat',
          area_hectares: '30',
        },
      ],
    });

    const result = await getPlantedCrop.execute('1');

    expect(result).toEqual({
      id: '1',
      cropName: 'Wheat',
      plantedAreaHectares: 30,
    });
  });
});
