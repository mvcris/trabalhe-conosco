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

export default class GetAllFarmOwner {
  constructor(private pg: Pg) {}

  async execute(): Promise<Output[]> {
    const result = await this.pg.query(
      `
      SELECT DISTINCT f.id as farm_id, f.name, f.city, f.state, f.farm_name, f.total_farm_area_hectares, f.arable_area_hectares, f.vegetation_area_hectares, p.id as planted_crop_id, p.crop_name, p.area_hectares
      FROM farm_owners f
      LEFT JOIN planted_crop p ON f.id = p.farm_id
    `
    );

    const farmOwners = result.rows.reduce((acc: Output[], row) => {
      const existingFarmOwner = acc.find(
        farmOwner => farmOwner.id === row.farm_id
      );

      if (existingFarmOwner) {
        if (row.planted_crop_id !== null) {
          const plantedCrop = {
            id: row.planted_crop_id,
            cropName: row.crop_name,
            plantedAreaHectares: parseInt(row.area_hectares),
          };
          existingFarmOwner.plantedCrops.push(plantedCrop);
        }
      } else {
        const farmOwner: Output = {
          id: row.farm_id,
          name: row.name,
          address: {
            city: row.city,
            state: row.state,
          },
          farm: {
            name: row.farm_name,
            totalFarmAreaHectares: parseInt(row.total_farm_area_hectares),
            arableAreaHectares: parseInt(row.arable_area_hectares),
            vegetationAreaHectares: parseInt(row.vegetation_area_hectares),
          },
          plantedCrops: [],
        };

        if (row.planted_crop_id !== null) {
          const plantedCrop = {
            id: row.planted_crop_id,
            cropName: row.crop_name,
            plantedAreaHectares: parseInt(row.area_hectares),
          };
          farmOwner.plantedCrops.push(plantedCrop);
        }

        acc.push(farmOwner);
      }

      return acc;
    }, []);

    return farmOwners;
  }
}
