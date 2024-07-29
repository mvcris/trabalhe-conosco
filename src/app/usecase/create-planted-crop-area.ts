import PlantedCrops, {CropTypes} from '../../domain/entity/PlantedCrops';
import FarmOwnerRepository from '../../domain/repository/FarmOwnerRepository';
import PlantedCropRepository from '../../domain/repository/PlantedCropRepository';

type Input = {
  farmId: string;
  cropName: string;
  plantedAreaHectares: number;
};

export default class CreatePlantedCropArea {
  constructor(
    private plantedCropRepository: PlantedCropRepository,
    private farmOwnerRepository: FarmOwnerRepository
  ) {}

  async execute(input: Input) {
    const farmOwner = await this.farmOwnerRepository.findById(input.farmId);
    if (!farmOwner) {
      throw new Error('Farm owner not found');
    }
    const plantedCrops = await this.plantedCropRepository.findByFarmId(
      input.farmId
    );
    const plantedCrop = PlantedCrops.create(
      input.farmId,
      input.cropName as CropTypes,
      input.plantedAreaHectares
    );
    farmOwner.addPlantedCropArea([...plantedCrops, plantedCrop]);
    await this.farmOwnerRepository.update(farmOwner);
    await this.plantedCropRepository.save(plantedCrop);
    return plantedCrop;
  }
}
