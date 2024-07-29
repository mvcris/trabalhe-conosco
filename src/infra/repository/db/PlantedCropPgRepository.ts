import PlantedCrops from '../../../domain/entity/PlantedCrops';
import PlantedCropRepository from '../../../domain/repository/PlantedCropRepository';
import Pg from './pg';

export default class PlantedCropPgRepository implements PlantedCropRepository {
  constructor(private pg: Pg) {}

  async save(plantedCrop: PlantedCrops): Promise<void> {
    await this.pg.query(
      ` 
        INSERT INTO planted_crop
        (id, farm_id, area_hectares, crop_name)
        VALUES 
        ($1, $2, $3, $4)
        `,
      [
        plantedCrop._id,
        plantedCrop._farmId,
        plantedCrop._plantedAreaHectares,
        plantedCrop._cropName,
      ]
    );
  }

  async findById(id: string): Promise<PlantedCrops | undefined> {
    const result = await this.pg.query(
      'SELECT * FROM planted_crop WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return undefined;
    }
    return PlantedCrops.restore(
      result.rows[0].id,
      result.rows[0].farm_id,
      result.rows[0].crop_name,
      parseInt(result.rows[0].area_hectares)
    );
  }

  async delete(id: string): Promise<void> {
    await this.pg.query('DELETE FROM planted_crop WHERE id = $1', [id]);
  }

  async findByFarmId(farmId: string): Promise<PlantedCrops[]> {
    const result = await this.pg.query(
      'SELECT * FROM planted_crop WHERE farm_id = $1',
      [farmId]
    );
    return result.rows.map((row: any) =>
      PlantedCrops.restore(
        row.id,
        row.farm_id,
        row.crop_name,
        parseInt(row.area_hectares)
      )
    );
  }
}
