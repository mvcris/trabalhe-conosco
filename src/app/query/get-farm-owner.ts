import Pg from '../../infra/repository/db/pg';

type Output = {
  id: string;
  name: string;
  address: {
    city: string;
    state: string;
  };
  farm: {
    name: string;
    totalFarmAreaHectares: number;
    arableAreaHectares: number;
    vegetationAreaHectares: number;
  };
  plantedCrops: {
    id: string;
    cropName: string;
    plantedAreaHectares: number;
  }[];
};

export default class GetFarmOwner {
  constructor(private pg: Pg) {}

  async execute(farmId: string): Promise<Output> {
    const result = await this.pg.query(
      `
      SELECT *, f.id as farm_id, p.id as planted_crop_id
      FROM farm_owners f
      LEFT JOIN planted_crop p ON f.id = p.farm_id
      WHERE f.id = $1
    `,
      [farmId]
    );

    if (result.rows.length === 0) {
      return {} as Output;
    }

    const plantedCrops = result.rows.map(row => {
      if (row.planted_crop_id === null) return {} as any;
      return {
        id: row.planted_crop_id,
        cropName: row.crop_name,
        plantedAreaHectares: parseInt(row.area_hectares),
      };
    });

    return {
      id: result.rows[0].farm_id,
      name: result.rows[0].name,
      address: {
        city: result.rows[0].city,
        state: result.rows[0].state,
      },
      farm: {
        name: result.rows[0].farm_name,
        totalFarmAreaHectares: parseInt(
          result.rows[0].total_farm_area_hectares
        ),
        arableAreaHectares: parseInt(result.rows[0].arable_area_hectares),
        vegetationAreaHectares: parseInt(
          result.rows[0].vegetation_area_hectares
        ),
      },
      plantedCrops,
    };
  }
}
