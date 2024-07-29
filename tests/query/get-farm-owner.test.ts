import GetFarmOwner from '../../src/app/query/get-farm-owner';
import Pg from '../../src/infra/repository/db/pg';

describe('GetFarmOwner', () => {
  let pg: Pg;
  let getFarmOwner: GetFarmOwner;

  beforeEach(() => {
    pg = {
      query: jest.fn(),
    } as unknown as Pg;
    getFarmOwner = new GetFarmOwner(pg);
  });

  it('should return an empty object when no rows are returned', async () => {
    (pg.query as jest.Mock).mockResolvedValue({rows: []});

    const result = await getFarmOwner.execute('some-farm-id');

    expect(result).toEqual({});
  });

  it('should return farm owner details with no planted crops', async () => {
    (pg.query as jest.Mock).mockResolvedValue({
      rows: [
        {
          farm_id: '1',
          name: 'Farm Owner',
          city: 'City',
          state: 'State',
          farm_name: 'Farm Name',
          total_farm_area_hectares: '100',
          arable_area_hectares: '60',
          vegetation_area_hectares: '40',
          planted_crop_id: null,
        },
      ],
    });

    const result = await getFarmOwner.execute('1');

    expect(result).toEqual({
      id: '1',
      name: 'Farm Owner',
      address: {
        city: 'City',
        state: 'State',
      },
      farm: {
        name: 'Farm Name',
        totalFarmAreaHectares: 100,
        arableAreaHectares: 60,
        vegetationAreaHectares: 40,
      },
      plantedCrops: [{}],
    });
  });

  it('should return farm owner details with planted crops', async () => {
    (pg.query as jest.Mock).mockResolvedValue({
      rows: [
        {
          farm_id: '1',
          name: 'Farm Owner',
          city: 'City',
          state: 'State',
          farm_name: 'Farm Name',
          total_farm_area_hectares: '100',
          arable_area_hectares: '60',
          vegetation_area_hectares: '40',
          planted_crop_id: '1',
          crop_name: 'Wheat',
          area_hectares: '30',
        },
        {
          farm_id: '1',
          name: 'Farm Owner',
          city: 'City',
          state: 'State',
          farm_name: 'Farm Name',
          total_farm_area_hectares: '100',
          arable_area_hectares: '60',
          vegetation_area_hectares: '40',
          planted_crop_id: '2',
          crop_name: 'Corn',
          area_hectares: '20',
        },
      ],
    });

    const result = await getFarmOwner.execute('1');

    expect(result).toEqual({
      id: '1',
      name: 'Farm Owner',
      address: {
        city: 'City',
        state: 'State',
      },
      farm: {
        name: 'Farm Name',
        totalFarmAreaHectares: 100,
        arableAreaHectares: 60,
        vegetationAreaHectares: 40,
      },
      plantedCrops: [
        {
          id: '1',
          cropName: 'Wheat',
          plantedAreaHectares: 30,
        },
        {
          id: '2',
          cropName: 'Corn',
          plantedAreaHectares: 20,
        },
      ],
    });
  });
});
