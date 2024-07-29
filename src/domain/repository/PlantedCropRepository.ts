import PlantedCrops from '../entity/PlantedCrops';

export default interface PlantedCropRepository {
  save(plantedCrop: PlantedCrops): Promise<void>;
  findById(id: string): Promise<PlantedCrops | undefined>;
  delete(id: string): Promise<void>;
  findByFarmId(farmId: string): Promise<PlantedCrops[]>;
}
