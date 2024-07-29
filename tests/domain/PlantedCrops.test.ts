import PlantedCrops, {CropTypes} from '../../src/domain/entity/PlantedCrops';

describe('PlantedCrops', () => {
  const farmId = 'farm-id';
  const cropName: CropTypes = 'Algodão';
  const plantedAreaHectares = 100;

  describe('create', () => {
    it('should create a new PlantedCrops instance', () => {
      const plantedCrop = PlantedCrops.create(
        farmId,
        cropName,
        plantedAreaHectares
      );

      expect(plantedCrop).toBeInstanceOf(PlantedCrops);
      expect(plantedCrop._farmId).toBe(farmId);
      expect(plantedCrop._cropName).toBe(cropName);
      expect(plantedCrop._plantedAreaHectares).toBe(plantedAreaHectares);
    });
  });

  describe('restore', () => {
    it('should restore a PlantedCrops instance', () => {
      const id = 'some-uuid';
      const plantedCrop = PlantedCrops.restore(
        id,
        farmId,
        cropName,
        plantedAreaHectares
      );

      expect(plantedCrop).toBeInstanceOf(PlantedCrops);
      expect(plantedCrop._id).toBe(id);
      expect(plantedCrop._farmId).toBe(farmId);
      expect(plantedCrop._cropName).toBe(cropName);
      expect(plantedCrop._plantedAreaHectares).toBe(plantedAreaHectares);
    });
  });

  describe('getters', () => {
    const id = 'some-uuid';
    const plantedCrop = PlantedCrops.restore(
      id,
      farmId,
      cropName,
      plantedAreaHectares
    );

    it('should return the correct id', () => {
      expect(plantedCrop._id).toBe(id);
    });

    it('should return the correct farmId', () => {
      expect(plantedCrop._farmId).toBe(farmId);
    });

    it('should return the correct cropName', () => {
      expect(plantedCrop._cropName).toBe(cropName);
    });

    it('should return the correct plantedAreaHectares', () => {
      expect(plantedCrop._plantedAreaHectares).toBe(plantedAreaHectares);
    });
  });
});
