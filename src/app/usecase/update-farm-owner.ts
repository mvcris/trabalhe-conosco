import FarmOwner from '../../domain/entity/FarmOwner';
import FarmOwnerRepository from '../../domain/repository/FarmOwnerRepository';
import PlantedCropRepository from '../../domain/repository/PlantedCropRepository';

type Input = {
  id: string;
  name?: string;
  registerNumber?: string;
  farm?: {
    name?: string;
    totalFarmAreaHectares?: number;
    arableAreaHectares?: number;
    vegetationAreaHectares?: number;
  };
  address?: {
    city: string;
    state: string;
  };
};

export default class UpdateFarmOwner {
  constructor(
    private farmOwnerRepository: FarmOwnerRepository,
    private plantedCropRepository: PlantedCropRepository
  ) {}

  async execute(input: Input): Promise<void> {
    if (!input.name && !input.registerNumber && !input.farm && !input.address) {
      return;
    }
    const farmOwner = await this.farmOwnerRepository.findById(input.id);
    if (!farmOwner) {
      throw new Error('Farm owner not found');
    }
    if (
      input.registerNumber &&
      input.registerNumber !== farmOwner._registerNumber.getValue()
    ) {
      const hasFarmOwner = await this.farmOwnerRepository.findByRegisterNumber(
        input.registerNumber
      );
      if (hasFarmOwner) {
        throw new Error('Farm owner already exists with given register number');
      }
    }

    const hasPlantedFarmArea = await this.plantedCropRepository.findByFarmId(
      input.id
    );

    if (hasPlantedFarmArea.length > 0) {
      const totalPlantedArea = hasPlantedFarmArea.reduce((prev, curr) => {
        return prev + curr._plantedAreaHectares;
      }, 0);

      if (
        input.farm?.arableAreaHectares &&
        input.farm.arableAreaHectares < totalPlantedArea
      ) {
        throw new Error('Arable area is less than total planted area');
      }
    }

    const updatedFarmOwner = FarmOwner.restore(
      input.id,
      input.registerNumber || farmOwner._registerNumber.getValue(),
      input.name || farmOwner._name,
      {
        city: input.address?.city || farmOwner._address._city,
        state: input.address?.state || farmOwner._address._state,
      },
      {
        name: input.farm?.name || farmOwner._farmArea._name,
        totalFarmAreaHectares:
          input.farm?.totalFarmAreaHectares ||
          farmOwner._farmArea._totalFarmAreaHectares,
        arableAreaHectares:
          input.farm?.arableAreaHectares ||
          farmOwner._farmArea._arableAreaHectares,
        vegetationAreaHectares:
          input.farm?.vegetationAreaHectares ||
          farmOwner._farmArea._vegetationAreaHectares,
      }
    );

    await this.farmOwnerRepository.update(updatedFarmOwner);
  }
}
