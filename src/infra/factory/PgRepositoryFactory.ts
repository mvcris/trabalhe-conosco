import FarmOwnerPgRepository from '../repository/db/FarmOwnerPgRepository';
import Pg from '../repository/db/pg';
import PlantedCropPgRepository from '../repository/db/PlantedCropPgRepository';

export default class PgRepositoryFactory {
  constructor(private pg: Pg) {}

  getPg() {
    return this.pg;
  }

  createFarmOwnerRepository() {
    return new FarmOwnerPgRepository(this.pg);
  }

  createPantedCropRepository() {
    return new PlantedCropPgRepository(this.pg);
  }
}
