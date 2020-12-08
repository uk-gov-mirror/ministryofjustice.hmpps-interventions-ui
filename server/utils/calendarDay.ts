export default class CalendarDay {
  constructor(readonly day: number, readonly month: number, readonly year: number) {}

  static parseIso8601(val: string): CalendarDay | null {
    const result = /^(\d+)-(\d+)-(\d+)$/.exec(val)

    if (result === null) {
      return null
    }

    return new CalendarDay(Number(result[3]), Number(result[2]), Number(result[1]))
  }

  get iso8601(): string {
    return [
      String(this.year).padStart(4, '0'),
      String(this.month).padStart(2, '0'),
      String(this.day).padStart(2, '0'),
    ].join('-')
  }
}
