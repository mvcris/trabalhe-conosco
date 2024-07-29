export default class Address {
  constructor(
    private city: string,
    private state: string
  ) {
    this.validate();
  }

  private validate() {
    if (this.city.length < 3) {
      throw new Error('City is invalid');
    }
    if (this.state.length < 2) {
      throw new Error('State is invalid');
    }
  }

  get _city() {
    return this.city;
  }

  get _state() {
    return this.state;
  }
}
