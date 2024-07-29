import GetAllFarmOwner from '../../src/app/query/get-all-farm-owner';
import Pg from '../../src/infra/repository/db/pg';

jest.mock('../../src/infra/repository/db/pg');

describe('GetAllFarmOwner', () => {
  let pg: Pg;
  let getAllFarmOwner: GetAllFarmOwner;

  beforeEach(() => {
    pg = new Pg();
    getAllFarmOwner = new GetAllFarmOwner(pg);
  });

  it('should return an empty array when there are no farm owners', async () => {
    (pg.query as jest.Mock).mockResolvedValue({rows: []});

    const result = await getAllFarmOwner.execute();

    expect(result).toEqual([]);
  });

  it('should return farm owners without planted crops', async () => {
    (pg.query as jest.Mock).mockResolvedValue({
      rows: [
        {
          farm_id: '1',
          name: 'Farm Owner 1',
          city: 'City 1',
          state: 'State 1',
          farm_name: 'Farm 1',
          total_farm_area_hectares: '100',
          arable_area_hectares: '50',
          vegetation_area_hectares: '50',
          planted_crop_id: null,
          crop_name: null,
          area_hectares: null,
        },
      ],
    });

    const result = await getAllFarmOwner.execute();

    expect(result).toEqual([
      {
        id: '1',
        name: 'Farm Owner 1',
        address: {
          city: 'City 1',
          state: 'State 1',
        },
        farm: {
          name: 'Farm 1',
          totalFarmAreaHectares: 100,
          arableAreaHectares: 50,
          vegetationAreaHectares: 50,
        },
        plantedCrops: [],
      },
    ]);
  });

  it('should return farm owners with planted crops', async () => {
    (pg.query as jest.Mock).mockResolvedValue({
      rows: [
        {
          farm_id: '1',
          name: 'Farm Owner 1',
          city: 'City 1',
          state: 'State 1',
          farm_name: 'Farm 1',
          total_farm_area_hectares: '100',
          arable_area_hectares: '50',
          vegetation_area_hectares: '50',
          planted_crop_id: 'crop1',
          crop_name: 'Crop 1',
          area_hectares: '10',
        },
      ],
    });

    const result = await getAllFarmOwner.execute();

    expect(result).toEqual([
      {
        id: '1',
        name: 'Farm Owner 1',
        address: {
          city: 'City 1',
          state: 'State 1',
        },
        farm: {
          name: 'Farm 1',
          totalFarmAreaHectares: 100,
          arableAreaHectares: 50,
          vegetationAreaHectares: 50,
        },
        plantedCrops: [
          {
            id: 'crop1',
            cropName: 'Crop 1',
            plantedAreaHectares: 10,
          },
        ],
      },
    ]);
  });

  it('should return multiple farm owners with and without planted crops', async () => {
    (pg.query as jest.Mock).mockResolvedValue({
      rows: [
        {
          farm_id: '1',
          name: 'Farm Owner 1',
          city: 'City 1',
          state: 'State 1',
          farm_name: 'Farm 1',
          total_farm_area_hectares: '100',
          arable_area_hectares: '50',
          vegetation_area_hectares: '50',
          planted_crop_id: 'crop1',
          crop_name: 'Crop 1',
          area_hectares: '10',
        },
        {
          farm_id: '2',
          name: 'Farm Owner 2',
          city: 'City 2',
          state: 'State 2',
          farm_name: 'Farm 2',
          total_farm_area_hectares: '200',
          arable_area_hectares: '100',
          vegetation_area_hectares: '100',
          planted_crop_id: null,
          crop_name: null,
          area_hectares: null,
        },
      ],
    });

    const result = await getAllFarmOwner.execute();

    expect(result).toEqual([
      {
        id: '1',
        name: 'Farm Owner 1',
        address: {
          city: 'City 1',
          state: 'State 1',
        },
        farm: {
          name: 'Farm 1',
          totalFarmAreaHectares: 100,
          arableAreaHectares: 50,
          vegetationAreaHectares: 50,
        },
        plantedCrops: [
          {
            id: 'crop1',
            cropName: 'Crop 1',
            plantedAreaHectares: 10,
          },
        ],
      },
      {
        id: '2',
        name: 'Farm Owner 2',
        address: {
          city: 'City 2',
          state: 'State 2',
        },
        farm: {
          name: 'Farm 2',
          totalFarmAreaHectares: 200,
          arableAreaHectares: 100,
          vegetationAreaHectares: 100,
        },
        plantedCrops: [],
      },
    ]);
  });
});
