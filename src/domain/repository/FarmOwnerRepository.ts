import FarmOwner from '../entity/FarmOwner';

export default interface FarmOwnerRepository {
  save(farmOwner: FarmOwner): Promise<FarmOwner>;
  findById(id: string): Promise<FarmOwner | undefined>;
  findByRegisterNumber(registerNumber: string): Promise<FarmOwner | undefined>;
  update(farmOwner: FarmOwner): Promise<FarmOwner>;
  delete(id: string): Promise<void>;
}
