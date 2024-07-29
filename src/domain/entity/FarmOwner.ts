import {randomUUID} from 'crypto';
import Address from './vo/Address';
import Cnpj from './vo/Cnpj';
import {Cpf} from './vo/Cpf';
import FarmArea from './vo/FarmArea';
import PlantedCrops from './PlantedCrops';

export default class FarmOwner {
  private constructor(
    private id: string,
    private registerNumber: Cnpj | Cpf,
    private name: string,
    private address: Address,
    private farmArea: FarmArea
  ) {}

  static create(
    registerNumber: string,
    name: string,
    address: {
      city: string;
      state: string;
    },
    farm: {
      name: string;
      totalFarmAreaHectares: number;
      arableAreaHectares: number;
      vegetationAreaHectares: number;
    }
  ): FarmOwner {
    const id = randomUUID();
    const addressVo = new Address(address.city, address.state);
    const registerNumberVo = this.checkIfIsCpfOrCnpj(registerNumber);
    const farmAreaVo = new FarmArea(
      farm.name,
      farm.totalFarmAreaHectares,
      farm.arableAreaHectares,
      farm.vegetationAreaHectares
    );
    return new FarmOwner(id, registerNumberVo, name, addressVo, farmAreaVo);
  }

  static restore(
    id: string,
    registerNumber: string,
    name: string,
    address: {
      city: string;
      state: string;
    },
    farm: {
      name: string;
      totalFarmAreaHectares: number;
      arableAreaHectares: number;
      vegetationAreaHectares: number;
    }
  ): FarmOwner {
    const addressVo = new Address(address.city, address.state);
    const registerNumberVo = this.checkIfIsCpfOrCnpj(registerNumber);
    const farmAreaVo = new FarmArea(
      farm.name,
      farm.totalFarmAreaHectares,
      farm.arableAreaHectares,
      farm.vegetationAreaHectares
    );
    return new FarmOwner(id, registerNumberVo, name, addressVo, farmAreaVo);
  }

  public static checkIfIsCpfOrCnpj(registerNumber: string): Cpf | Cnpj {
    if (registerNumber.length === 11) {
      return new Cpf(registerNumber);
    } else {
      return new Cnpj(registerNumber);
    }
  }

  public addPlantedCropArea(arableAreaHectares: PlantedCrops[]) {
    const totalPlantedArea = arableAreaHectares.reduce(
      (acc, crop) => acc + crop._plantedAreaHectares,
      0
    );
    if (totalPlantedArea > this.farmArea._arableAreaHectares) {
      throw new Error('Arable area is greater than the farm area');
    }
  }

  get _id(): string {
    return this.id;
  }

  get _registerNumber(): Cnpj | Cpf {
    return this.registerNumber;
  }

  get _name(): string {
    return this.name;
  }

  get _address(): Address {
    return this.address;
  }

  get _farmArea(): FarmArea {
    return this.farmArea;
  }
}
