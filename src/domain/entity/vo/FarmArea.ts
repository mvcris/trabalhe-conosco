export default class FarmArea {
  constructor(
    private name: string,
    private totalFarmAreaHectares: number,
    private arableAreaHectares: number,
    private vegetationAreaHectares: number
  ) {
    this.validate();
  }

  private validate() {
    if (this.totalFarmAreaHectares <= 0) {
      throw new Error('The total farm area must be greater than zero');
    }
    if (this.arableAreaHectares < 0) {
      throw new Error('The arable area must be greater than zero');
    }
    if (this.vegetationAreaHectares < 0) {
      throw new Error('The vegetation area must be greater than zero');
    }

    if (
      this.arableAreaHectares + this.vegetationAreaHectares >
      this.totalFarmAreaHectares
    ) {
      throw new Error(
        'The sum of arable area and vegetation area must be less than or equal to the total farm area'
      );
    }
  }

  get _name(): string {
    return this.name;
  }

  get _totalFarmAreaHectares(): number {
    return this.totalFarmAreaHectares;
  }

  get _arableAreaHectares(): number {
    return this.arableAreaHectares;
  }

  get _vegetationAreaHectares(): number {
    return this.vegetationAreaHectares;
  }

  setArableAreaHectares(areaHectares: number) {
    if (areaHectares < 0) {
      throw new Error('The arable area must be greater than zero');
    }
    if (areaHectares > this.totalFarmAreaHectares) {
      throw new Error(
        'The arable area must be less than or equal to the total farm area'
      );
    }
    this.arableAreaHectares = areaHectares;
  }
}
