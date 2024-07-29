import FarmOwner from '../../../domain/entity/FarmOwner';
import FarmOwnerRepository from '../../../domain/repository/FarmOwnerRepository';
import Pg from './pg';

export default class FarmOwnerPgRepository implements FarmOwnerRepository {
  constructor(private pg: Pg) {}

  async save(farmOwner: FarmOwner): Promise<FarmOwner> {
    await this.pg.query(
      `
      INSERT INTO farm_owners (
        id, 
        register_number,
        name,
        city,
        state,
        farm_name,
        total_farm_area_hectares,
        arable_area_hectares,
        vegetation_area_hectares
      ) VALUES
      (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9
      )
    `,
      [
        farmOwner._id,
        farmOwner._registerNumber.getValue(),
        farmOwner._name,
        farmOwner._address._city,
        farmOwner._address._state,
        farmOwner._farmArea._name,
        farmOwner._farmArea._totalFarmAreaHectares,
        farmOwner._farmArea._arableAreaHectares,
        farmOwner._farmArea._vegetationAreaHectares,
      ]
    );
    return farmOwner;
  }

  async findById(id: string): Promise<FarmOwner | undefined> {
    const result = await this.pg.query(
      'SELECT * FROM farm_owners WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return undefined;
    }
    const farmOwnerData = result.rows[0];
    return FarmOwner.restore(
      farmOwnerData.id,
      farmOwnerData.register_number,
      farmOwnerData.name,
      {
        city: farmOwnerData.city,
        state: farmOwnerData.state,
      },
      {
        name: farmOwnerData.farm_name,
        totalFarmAreaHectares: parseInt(farmOwnerData.total_farm_area_hectares),
        arableAreaHectares: parseInt(farmOwnerData.arable_area_hectares),
        vegetationAreaHectares: parseInt(
          farmOwnerData.vegetation_area_hectares
        ),
      }
    );
  }

  async findByRegisterNumber(
    registerNumber: string
  ): Promise<FarmOwner | undefined> {
    const result = await this.pg.query(
      'SELECT * FROM farm_owners WHERE register_number = $1',
      [registerNumber]
    );
    if (result.rows.length === 0) {
      return undefined;
    }
    const farmOwnerData = result.rows[0];
    return FarmOwner.restore(
      farmOwnerData.id,
      farmOwnerData.register_number,
      farmOwnerData.name,
      {
        city: farmOwnerData.city,
        state: farmOwnerData.state,
      },
      {
        name: farmOwnerData.farm_name,
        totalFarmAreaHectares: parseInt(farmOwnerData.total_farm_area_hectares),
        arableAreaHectares: parseInt(farmOwnerData.arable_area_hectares),
        vegetationAreaHectares: parseInt(
          farmOwnerData.vegetation_area_hectares
        ),
      }
    );
  }

  async update(farmOwner: FarmOwner): Promise<FarmOwner> {
    await this.pg.query(
      `
        UPDATE farm_owners
        SET   name = $1,
              city = $2,
              state = $3,
              register_number = $4,
              farm_name = $5,
              total_farm_area_hectares = $6,
              arable_area_hectares = $7,
              vegetation_area_hectares = $8
        WHERE id = $9
    `,
      [
        farmOwner._name,
        farmOwner._address._city,
        farmOwner._address._state,
        farmOwner._registerNumber.getValue(),
        farmOwner._farmArea._name,
        farmOwner._farmArea._totalFarmAreaHectares,
        farmOwner._farmArea._arableAreaHectares,
        farmOwner._farmArea._vegetationAreaHectares,
        farmOwner._id,
      ]
    );
    return farmOwner;
  }

  async delete(id: string): Promise<void> {
    await this.pg.query('DELETE FROM farm_owners WHERE id = $1', [id]);
  }
}
