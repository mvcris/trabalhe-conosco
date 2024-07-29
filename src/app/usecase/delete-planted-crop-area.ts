import PlantedCropRepository from '../../domain/repository/PlantedCropRepository';
export class DeletePlantedCropArea {
  constructor(
    private readonly plantedCropAreaRepository: PlantedCropRepository
  ) {}

  async execute(id: string): Promise<void> {
    const plantedCropArea = await this.plantedCropAreaRepository.findById(id);
    if (!plantedCropArea) {
      throw new Error('Planted crop area not found');
    }
    await this.plantedCropAreaRepository.delete(id);
  }
}
