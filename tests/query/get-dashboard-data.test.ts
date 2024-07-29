import {GetDashboardData} from '../../src/app/query/get-dashboard-data';
import Pg from '../../src/infra/repository/db/pg';

jest.mock('../../src/infra/repository/db/pg');

describe('GetDashboardData', () => {
  let pg: Pg;
  let getDashboardData: GetDashboardData;

  beforeEach(() => {
    pg = new Pg();
    getDashboardData = new GetDashboardData(pg);
  });

  it('should return dashboard data when all queries return valid data', async () => {
    (pg.query as jest.Mock).mockResolvedValue({
      rows: [
        {
          total_farms: 10,
          total_farm_area: 1000,
          farms_by_state: [
            {state: 'State 1', farm_count: 5},
            {state: 'State 2', farm_count: 5},
          ],
          area_by_crop: [
            {crop_name: 'Crop 1', total_area: 500},
            {crop_name: 'Crop 2', total_area: 500},
          ],
          total_arable_area: 800,
          total_vegetation_area: 200,
        },
      ],
    });

    const result = await getDashboardData.execute();

    expect(result).toEqual({
      total_farms: 10,
      total_farm_area: 1000,
      farms_by_state: [
        {state: 'State 1', farm_count: 5},
        {state: 'State 2', farm_count: 5},
      ],
      area_by_crop: [
        {crop_name: 'Crop 1', total_area: 500},
        {crop_name: 'Crop 2', total_area: 500},
      ],
      total_arable_area: 800,
      total_vegetation_area: 200,
    });
  });

  it('should return dashboard data with null or zero values', async () => {
    (pg.query as jest.Mock).mockResolvedValue({
      rows: [
        {
          total_farms: 0,
          total_farm_area: 0,
          farms_by_state: [],
          area_by_crop: [],
          total_arable_area: 0,
          total_vegetation_area: 0,
        },
      ],
    });

    const result = await getDashboardData.execute();

    expect(result).toEqual({
      total_farms: 0,
      total_farm_area: 0,
      farms_by_state: [],
      area_by_crop: [],
      total_arable_area: 0,
      total_vegetation_area: 0,
    });
  });

  it('should return dashboard data when there are no farm owners or crops', async () => {
    (pg.query as jest.Mock).mockResolvedValue({
      rows: [
        {
          total_farms: 0,
          total_farm_area: 0,
          farms_by_state: [],
          area_by_crop: [],
          total_arable_area: 0,
          total_vegetation_area: 0,
        },
      ],
    });

    const result = await getDashboardData.execute();

    expect(result).toEqual({
      total_farms: 0,
      total_farm_area: 0,
      farms_by_state: [],
      area_by_crop: [],
      total_arable_area: 0,
      total_vegetation_area: 0,
    });
  });
});
