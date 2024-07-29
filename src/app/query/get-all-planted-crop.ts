import Pg from '../../infra/repository/db/pg';

type Output = {
  id: string;
  cropName: string;
  plantedAreaHectares: number;
};

export default class GetAllPlantedCrop {
  constructor(private pg: Pg) {}

  async execute(): Promise<Output[]> {
    const result = await this.pg.query(
      `
      SELECT *
      FROM planted_crop
    `
    );
    return result.rows.map(row => ({
      id: row.id,
      cropName: row.crop_name,
      plantedAreaHectares: parseInt(row.area_hectares),
    }));
  }
}
