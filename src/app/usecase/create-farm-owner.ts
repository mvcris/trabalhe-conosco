import FarmOwner from '../../domain/entity/FarmOwner';
import FarmOwnerRepository from '../../domain/repository/FarmOwnerRepository';

type Input = {
  name: string;
  registerNumber: string;
  farm: {
    name: string;
    totalFarmAreaHectares: number;
    arableAreaHectares: number;
    vegetationAreaHectares: number;
  };
  address: {
    city: string;
    state: string;
  };
};

type Output = Input & {
  id: string;
};

export default class CreateFarmOwner {
  constructor(private farmOwnerRepository: FarmOwnerRepository) {}

  async execute(input: Input): Promise<Output> {
    const hasFarmOwner = await this.farmOwnerRepository.findByRegisterNumber(
      input.registerNumber
    );
    if (hasFarmOwner) {
      throw new Error('Farm owner already exists with given register number');
    }
    const farmOwner = FarmOwner.create(
      input.registerNumber,
      input.name,
      input.address,
      input.farm
    );
    await this.farmOwnerRepository.save(farmOwner);
    return {
      id: farmOwner._id,
      ...input,
    };
  }
}
