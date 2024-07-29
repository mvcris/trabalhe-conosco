import Pg from '../../infra/repository/db/pg';

type Output = {
  id: string;
  cropName: string;
  plantedAreaHectares: number;
};

export default class GetPlantedCrop {
  constructor(private pg: Pg) {}

  async execute(plantedCropId: string): Promise<Output> {
    const result = await this.pg.query(
      `
      SELECT *
      FROM planted_crop
      WHERE id = $1
    `,
      [plantedCropId]
    );

    if (result.rows.length === 0) {
      return {} as Output;
    }

    return {
      id: result.rows[0].id,
      cropName: result.rows[0].crop_name,
      plantedAreaHectares: parseInt(result.rows[0].area_hectares),
    };
  }
}
