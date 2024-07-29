import 'dotenv/config';
import PlantedCropPgRepository from '../../src/infra/repository/db/PlantedCropPgRepository';
import Pg from '../../src/infra/repository/db/pg';
import PlantedCrops from '../../src/domain/entity/PlantedCrops';
import {randomUUID} from 'crypto';

process.env.PG_DATABASE = 'farm_test';

describe('PlantedCropPgRepository with real PostgreSQL', () => {
  let plantedCropPgRepository: PlantedCropPgRepository;
  let samplePlantedCrop: PlantedCrops;
  let pg: Pg;
  let uuid: string;
  let farmId: string;

  beforeAll(async () => {
    uuid = randomUUID();
    farmId = randomUUID();
    pg = new Pg();
    await pg.connect();
    plantedCropPgRepository = new PlantedCropPgRepository(pg);
    await pg.query(
      `CREATE TABLE planted_crop (
        id uuid PRIMARY KEY, 
        farm_id uuid, 
        area_hectares bigint, 
        crop_name varchar
      )`
    );
  });

  beforeEach(async () => {
    samplePlantedCrop = PlantedCrops.restore(uuid, farmId, 'Algodão', 100);
    await pg.query('DELETE FROM planted_crop');
  });

  afterAll(async () => {
    await pg.query('DROP TABLE planted_crop');
    await pg.disconnect();
  });

  it('should save a planted crop successfully', async () => {
    await plantedCropPgRepository.save(samplePlantedCrop);

    const result = await pg.query('SELECT * FROM planted_crop WHERE id = $1', [
      uuid,
    ]);
    expect(result.rows.length).toBe(1);
    expect(result.rows[0].id).toBe(samplePlantedCrop._id);
  });

  it('should find a planted crop by id', async () => {
    await plantedCropPgRepository.save(samplePlantedCrop);

    const result = await plantedCropPgRepository.findById(uuid);
    expect(result?._id).toEqual(uuid);
  });

  it('should return undefined if planted crop is not found by id', async () => {
    const result = await plantedCropPgRepository.findById(uuid);
    expect(result).toBeUndefined();
  });

  it('should delete a planted crop successfully', async () => {
    await plantedCropPgRepository.save(samplePlantedCrop);

    await plantedCropPgRepository.delete(uuid);

    const result = await pg.query('SELECT * FROM planted_crop WHERE id = $1', [
      uuid,
    ]);
    expect(result.rows.length).toBe(0);
  });

  it('should find planted crops by farm id', async () => {
    await plantedCropPgRepository.save(samplePlantedCrop);

    const result = await plantedCropPgRepository.findByFarmId(farmId);
    expect(result.length).toBe(1);
    expect(result[0]._id).toEqual(uuid);
  });
});
