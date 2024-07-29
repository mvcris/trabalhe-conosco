import FarmOwnerRepository from '../../domain/repository/FarmOwnerRepository';

export class DeleteFarmOwner {
  constructor(private farmOwnerRepository: FarmOwnerRepository) {}

  async execute(id: string): Promise<void> {
    const farmOwner = await this.farmOwnerRepository.findById(id);
    if (!farmOwner) {
      throw new Error('Farm owner not found');
    }
    await this.farmOwnerRepository.delete(id);
  }
}
