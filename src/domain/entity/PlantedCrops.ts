import {randomUUID} from 'crypto';

export type CropTypes =
  | 'Soja'
  | 'Milho'
  | 'Algodão'
  | 'Café'
  | 'Cana de Açucar';

export default class PlantedCrops {
  constructor(
    private id: string,
    private farmId: string,
    private cropName: CropTypes,
    private plantedAreaHectares: number
  ) {}

  static create(
    farmId: string,
    cropName: CropTypes,
    plantedAreaHectares: number
  ): PlantedCrops {
    const id = randomUUID();
    return new PlantedCrops(id, farmId, cropName, plantedAreaHectares);
  }

  static restore(
    id: string,
    farmId: string,
    cropName: CropTypes,
    plantedAreaHectares: number
  ): PlantedCrops {
    return new PlantedCrops(id, farmId, cropName, plantedAreaHectares);
  }

  get _id(): string {
    return this.id;
  }

  get _farmId(): string {
    return this.farmId;
  }

  get _plantedAreaHectares(): number {
    return this.plantedAreaHectares;
  }

  get _cropName(): CropTypes {
    return this.cropName;
  }
}
