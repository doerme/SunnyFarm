export class TimeSystem {
  constructor(private day: number) {}

  getDay(): number {
    return this.day;
  }

  nextDay(): number {
    this.day += 1;
    return this.day;
  }
}

