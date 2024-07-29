import 'dotenv/config';
import FarmOwnerPgRepository from '../../src/infra/repository/db/FarmOwnerPgRepository';
import Pg from '../../src/infra/repository/db/pg';
import FarmOwner from '../../src/domain/entity/FarmOwner';
import {randomUUID} from 'crypto';

process.env.PG_DATABASE = 'farm_test';

describe('FarmOwnerPgRepository with real PostgreSQL', () => {
  let farmOwnerPgRepository: FarmOwnerPgRepository;
  let sampleFarmOwner: FarmOwner;
  let pg: Pg;
  let uuid: string;

  beforeAll(async () => {
    uuid = randomUUID();
    pg = new Pg();
    await pg.connect();
    farmOwnerPgRepository = new FarmOwnerPgRepository(pg);
    await pg.query(
      `CREATE TABLE farm_owners (
        id uuid PRIMARY KEY, 
        register_number varchar, 
        name varchar, 
        city varchar, 
        state varchar, 
        farm_name varchar, 
        total_farm_area_hectares bigint, 
        arable_area_hectares bigint, 
        vegetation_area_hectares bigint
      )`
    );
  });

  beforeEach(async () => {
    sampleFarmOwner = FarmOwner.restore(
      uuid,
      '73347256000143',
      'Valid Name',
      {city: 'Valid City', state: 'VS'},
      {
        name: 'Valid Farm Name',
        totalFarmAreaHectares: 200,
        arableAreaHectares: 15,
        vegetationAreaHectares: 15,
      }
    );
    await pg.query('DELETE FROM farm_owners');
  });

  afterAll(async () => {
    await pg.query('DROP TABLE farm_owners');
    await pg.disconnect();
  });

  it('should save a farm owner successfully', async () => {
    await farmOwnerPgRepository.save(sampleFarmOwner);

    const result = await pg.query('SELECT * FROM farm_owners WHERE id = $1', [
      uuid,
    ]);
    expect(result.rows.length).toBe(1);
    expect(result.rows[0].id).toBe(sampleFarmOwner._id);
  });

  it('should find a farm owner by id', async () => {
    await farmOwnerPgRepository.save(sampleFarmOwner);

    const result = await farmOwnerPgRepository.findById(uuid);
    expect(result?._id).toEqual(uuid);
  });

  it('should return undefined if farm owner is not found by id', async () => {
    const result = await farmOwnerPgRepository.findById(uuid);
    expect(result).toBeUndefined();
  });

  it('should find a farm owner by register number', async () => {
    await farmOwnerPgRepository.save(sampleFarmOwner);
    const result =
      await farmOwnerPgRepository.findByRegisterNumber('73347256000143');
    expect(result?._registerNumber.getValue()).toEqual(
      sampleFarmOwner._registerNumber.getValue()
    );
  });

  it('should return undefined if farm owner is not found by register number', async () => {
    const result =
      await farmOwnerPgRepository.findByRegisterNumber('73347256000143');
    expect(result).toBeUndefined();
  });

  it('should update a farm owner successfully', async () => {
    await farmOwnerPgRepository.save(sampleFarmOwner);

    sampleFarmOwner = FarmOwner.restore(
      uuid,
      '73347256000143',
      'Updated Name',
      {city: 'Updated City', state: 'US'},
      {
        name: 'Updated Farm Name',
        totalFarmAreaHectares: 200,
        arableAreaHectares: 5,
        vegetationAreaHectares: 5,
      }
    );
    await farmOwnerPgRepository.update(sampleFarmOwner);

    const result = await pg.query('SELECT * FROM farm_owners WHERE id = $1', [
      uuid,
    ]);
    expect(result.rows[0].name).toBe('Updated Name');
  });

  it('should delete a farm owner successfully', async () => {
    await farmOwnerPgRepository.save(sampleFarmOwner);

    await farmOwnerPgRepository.delete(uuid);

    const result = await pg.query('SELECT * FROM farm_owners WHERE id = $1', [
      uuid,
    ]);
    expect(result.rows.length).toBe(0);
  });
});
